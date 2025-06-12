import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
            <div className="flex flex-col items-center gap-4">
                <FileQuestion className="h-24 w-24 text-muted-foreground" />
                <h1 className="text-4xl font-bold text-foreground">404</h1>
                <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
                <p className="text-muted-foreground max-w-md">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4 mt-4">
                    <Button onClick={() => navigate(-1)} variant="outline">
                        Go Back
                    </Button>
                    <Button onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 