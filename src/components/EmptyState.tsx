import { HiCube } from 'react-icons/hi2'

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ 
  icon = <HiCube className="w-20 h-20 mx-auto text-gray-400" />, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="mb-6 animate-scale-in">
        {icon}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <a
          href={action.href}
          className="inline-block bg-gradient-primary text-white px-8 py-3 rounded-button font-semibold hover:scale-[1.02] transition-all shadow-elevation-2 hover:shadow-elevation-3"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
