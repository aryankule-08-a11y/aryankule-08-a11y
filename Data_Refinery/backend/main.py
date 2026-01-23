from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import json
from cleaner import DataCleaner

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Data Refinery API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format")
    
    # For very large files (up to 500MB), we read in chunks or ensure memory is handled
    contents = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            # Using low_memory=False for better type inference on larger datasets
            df = pd.read_csv(io.BytesIO(contents), low_memory=False)
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")

    cleaner = DataCleaner(df)
    cleaned_df, report_data = cleaner.clean()
    
    # Save cleaned data to buffer
    output = io.StringIO()
    cleaned_df.to_csv(output, index=False)
    cleaned_csv = output.getvalue()
    
    return {
        "filename": file.filename,
        "report": report_data,
        "preview": cleaned_df.head(10).to_dict(orient="records"),
        "csv_data": cleaned_csv
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
