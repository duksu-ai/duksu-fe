import { Button } from './ui/button';
import { User, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

interface TitleBarProps {
  showAvatar?: boolean;
  avatar_url?: string;
}

export default function TitleBar({ showAvatar = false, avatar_url }: TitleBarProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLogoutDialogOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div 
      className="top-0 left-0 right-0 z-50 bg-transparent flex items-center justify-end px-4 py-2"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div 
        className="flex items-center gap-4"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-sm"
        >
          Need Support?
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-sm"
        >
          Community
        </Button>
        {showAvatar && (
          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatar_url} alt="User Avatar" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be signed out of your account and returned to the login screen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}