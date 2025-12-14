import { Loader2 } from 'lucide-react';

export default function Spinner() {
  return (
    <div className="flex w-full justify-center p-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );
}