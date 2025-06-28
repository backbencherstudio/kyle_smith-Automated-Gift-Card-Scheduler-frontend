import Image from 'next/image';
import React from 'react';

interface UserAvatarProps {
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  avatar, 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    custom: 'w-full h-full'
  };

  const iconSizes = {
    sm: 'w-3/4 h-3/4',
    md: 'w-2/3 h-2/3',
    lg: 'w-3/4 h-3/4',
    xl: 'w-4/5 h-4/5',
    custom: 'w-3/4 h-3/4'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      {avatar ? (
        <Image 
          src={avatar} 
          alt="User Avatar" 
          width={48} 
          height={48} 
          className="w-full h-full rounded-full object-cover" 
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <svg 
            className={`${iconSizes[size]} text-gray-600`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default UserAvatar; 