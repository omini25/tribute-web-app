
export function Spinner({ size = 'md' }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <div className={`animate-spin rounded-full border-2 border-t-2 border-gray-200 border-t-blue-500 ${sizeClasses[size]}`}></div>
    );
}