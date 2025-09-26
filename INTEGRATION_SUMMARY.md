# Worker Recommendation System Integration

## Overview
Successfully integrated the backend Python-based worker recommendation system with the frontend React AssignWorkerDialog component.

## Integration Components

### Backend (`backend/src/routes/workersPrediction.routes.ts`)
- **GET `/workers-prediction/recommend`**: Returns recommended workers with filtering options
- **POST `/workers-prediction/assign-task`**: Updates worker task count when assigned
- **Features**:
  - Runs Python recommendation script
  - Applies filtering by locality and worker type
  - Returns JSON or CSV format
  - Transforms data to match frontend expectations

### Frontend Service (`waste-management/services/workerRecommendation.service.ts`)
- **`getRecommendedWorkers()`**: Fetches recommendations from backend API
- **`assignTaskToWorker()`**: Assigns task and updates backend
- **`calculateTaskDifficulty()`**: Calculates task difficulty from complaint description
- **Features**:
  - Handles CSV to JSON parsing
  - Maps backend field names to frontend structure
  - Error handling with fallbacks

### React Component (`waste-management/components/complaints/AssignWorkerDialog.tsx`)
- **Enhanced Features**:
  - Automatic recommendation fetching when dialog opens
  - Complaint-specific worker type detection
  - Loading states and refresh functionality
  - Integrated task assignment with backend updates
  - Fallback to regular workers if recommendations fail

### Hook Integration (`waste-management/hooks/useComplaints.ts`)
- **Enhanced `fetchRecommendedWorkers()`**: Accepts complaint context for better recommendations
- **Smart filtering**: Filters by locality and worker type based on complaint
- **Fallback algorithm**: Local scoring when API fails

## Data Flow

1. **User clicks "Assign Worker"** on a complaint
2. **Dialog opens** and automatically fetches recommendations
3. **Backend runs Python script** to generate recommendations
4. **Frontend receives** and displays top recommended workers
5. **User selects worker** and confirms assignment
6. **Backend updates** worker task count and difficulty
7. **Frontend updates** complaint status to "IN_PROGRESS"

## Key Features

### Smart Recommendations
- **Locality-based**: Prefers workers from same area
- **Worker type detection**: Automatically determines SWEEPER vs WASTE_COLLECTOR
- **Task difficulty calculation**: Based on complaint description keywords
- **Real-time scoring**: Uses Python ML model for predictions

### User Experience
- **Loading states**: Shows skeleton cards while fetching
- **Refresh button**: Manual recommendation refresh
- **Fallback display**: Shows regular workers if API fails
- **Worker details**: Comprehensive worker information display

### Error Handling
- **API failures**: Graceful fallback to local algorithm
- **Network issues**: Maintains functionality with dummy data
- **Invalid responses**: Proper error logging and user feedback

## API Endpoints

### Get Recommendations
```
GET /workers-prediction/recommend?locality=MG Road&workerType=SWEEPER&limit=10&format=json
```

### Assign Task
```
POST /workers-prediction/assign-task
{
  "workerId": "worker_123",
  "complaintId": 456,
  "taskDifficulty": 5
}
```

## Testing the Integration

### Prerequisites
1. **Backend server running**: `cd backend && npm run dev`
2. **Frontend server running**: `cd waste-management && npm run dev`
3. **Python environment**: Ensure Python3 and required packages are installed

### Test Steps
1. **Open complaints page**: Navigate to `/dashboard/complaints`
2. **Click "Assign Worker"** on any pending complaint
3. **Verify recommendations load**: Should show top 6 recommended workers
4. **Check worker details**: Verify scores and worker information
5. **Test assignment**: Select a worker and confirm assignment
6. **Verify backend update**: Check that worker task count increases

### Expected Behavior
- **Recommendations appear** within 2-3 seconds
- **Workers sorted by score** (highest first)
- **Locality preference** visible in results
- **Assignment updates** both frontend and backend
- **Error handling** graceful with fallbacks

## Configuration

### Environment Variables
```bash
# Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Backend (.env)
PORT=8080
```

### API Configuration
- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL`
- **Timeout**: 30 seconds for recommendation requests
- **Retry logic**: Automatic fallback to local algorithm

## Troubleshooting

### Common Issues
1. **Python script fails**: Check Python installation and dependencies
2. **CORS errors**: Verify backend CORS configuration
3. **No recommendations**: Check CSV file paths and permissions
4. **Assignment fails**: Verify worker IDs match between systems

### Debug Steps
1. **Check browser console** for API errors
2. **Verify backend logs** for Python script output
3. **Test API endpoints** directly with curl/Postman
4. **Check CSV files** in `backend/datasets/` directory

## Future Enhancements

### Planned Features
- **Real-time updates**: WebSocket integration for live recommendations
- **Advanced filtering**: More sophisticated locality matching
- **Performance metrics**: Track assignment success rates
- **A/B testing**: Compare recommendation algorithms

### Optimization Opportunities
- **Caching**: Cache recommendations for similar complaints
- **Batch processing**: Process multiple assignments together
- **Predictive loading**: Pre-fetch recommendations for likely assignments
- **Mobile optimization**: Responsive design improvements

## Files Modified

### Backend
- `backend/src/routes/workersPrediction.routes.ts` - Enhanced recommendation endpoint
- `backend/datasets/recommended.csv` - Generated by Python script

### Frontend
- `waste-management/services/workerRecommendation.service.ts` - New service
- `waste-management/components/complaints/AssignWorkerDialog.tsx` - Enhanced dialog
- `waste-management/hooks/useComplaints.ts` - Enhanced hook
- `waste-management/app/(protected)/dashboard/complaints/(layouts)/Admin.tsx` - Updated integration

## Success Metrics
- **Recommendation accuracy**: 85%+ user satisfaction
- **Response time**: <3 seconds for recommendations
- **Assignment success**: 95%+ successful assignments
- **Error rate**: <5% API failures with graceful fallbacks