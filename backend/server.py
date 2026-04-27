from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import aiohttp
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    client.close()


app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """
    Remove background from uploaded image using remove.bg API.
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an image (JPG, PNG, WEBP)"
        )
    
    # Read file content
    try:
        content = await file.read()
        file_size = len(content)
        
        # Check file size (25MB limit)
        if file_size > 25000000:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds maximum of 25MB"
            )
        
        # Get API key from environment
        api_key = os.environ.get('REMOVE_BG_API_KEY')
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="Background removal service not configured"
            )
        
        # Call remove.bg API
        async with aiohttp.ClientSession() as session:
            form_data = aiohttp.FormData()
            form_data.add_field('size', 'auto')
            form_data.add_field('image_file', content, filename=file.filename)
            
            async with session.post(
                'https://api.remove.bg/v1.0/removebg',
                data=form_data,
                headers={'X-Api-Key': api_key},
                timeout=aiohttp.ClientTimeout(total=60)
            ) as response:
                
                if response.status == 429:
                    retry_after = response.headers.get('Retry-After', '60')
                    raise HTTPException(
                        status_code=429,
                        detail=f"Rate limit exceeded. Please try again after {retry_after} seconds"
                    )
                
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"remove.bg API error: {response.status} - {error_text}")
                    raise HTTPException(
                        status_code=response.status,
                        detail=f"Background removal failed: {error_text}"
                    )
                
                # Read processed image
                processed_image = await response.read()
                processed_base64 = base64.b64encode(processed_image).decode('utf-8')
                
                return {
                    "filename": file.filename,
                    "processed_image": processed_base64,
                    "original_size": file_size,
                    "processed_size": len(processed_image),
                    "status": "success"
                }
    
    except aiohttp.ClientError as e:
        logger.error(f"Network error calling remove.bg API: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Failed to connect to background removal service"
        )
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )

@api_router.get("/sitemap.xml")
async def generate_sitemap():
    """
    Dynamically generate sitemap.xml for all tools and pages.
    This ensures Google always has the latest list of pages.
    """
    
    base_url = "https://helpfulwebtools.net"
    current_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Define all tool routes
    tools = [
        # Image Tools
        {"path": "/tools/image-resize", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/image-crop", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/image-compressor", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/format-converter", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/background-remover", "priority": "0.9", "changefreq": "monthly"},
        
        # PDF Tools
        {"path": "/tools/pdf-merge", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/pdf-split", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/pdf-to-image", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/invoice-generator", "priority": "0.8", "changefreq": "monthly"},
        
        # Developer Tools
        {"path": "/tools/qr-generator", "priority": "0.8", "changefreq": "monthly"},
        
        # Text Tools
        {"path": "/tools/case-converter", "priority": "0.7", "changefreq": "monthly"},
        {"path": "/tools/lorem-ipsum", "priority": "0.7", "changefreq": "monthly"},
        {"path": "/tools/word-counter", "priority": "0.7", "changefreq": "monthly"},
        
        # Math & Finance
        {"path": "/tools/percentage-calculator", "priority": "0.9", "changefreq": "monthly"},
        {"path": "/tools/discount-calculator", "priority": "0.9", "changefreq": "monthly"},
        {"path": "/tools/date-calculator", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/age-calculator", "priority": "0.8", "changefreq": "monthly"},
        {"path": "/tools/loan-calculator", "priority": "0.9", "changefreq": "monthly"},
        
        # Creator Tools
        {"path": "/tools/youtube-thumbnail", "priority": "0.9", "changefreq": "monthly"},
        
        # Utilities
        {"path": "/tools/password-generator", "priority": "0.8", "changefreq": "monthly"},
    ]
    
    # Build XML
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Homepage
    xml_content += '  <url>\n'
    xml_content += f'    <loc>{base_url}</loc>\n'
    xml_content += f'    <lastmod>{current_date}</lastmod>\n'
    xml_content += '    <changefreq>weekly</changefreq>\n'
    xml_content += '    <priority>1.0</priority>\n'
    xml_content += '  </url>\n'
    
    # Add all tools
    for tool in tools:
        xml_content += '  <url>\n'
        xml_content += f'    <loc>{base_url}{tool["path"]}</loc>\n'
        xml_content += f'    <lastmod>{current_date}</lastmod>\n'
        xml_content += f'    <changefreq>{tool["changefreq"]}</changefreq>\n'
        xml_content += f'    <priority>{tool["priority"]}</priority>\n'
        xml_content += '  </url>\n'
    
    xml_content += '</urlset>'
    
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={
            "Cache-Control": "public, max-age=3600"  # Cache for 1 hour
        }
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

