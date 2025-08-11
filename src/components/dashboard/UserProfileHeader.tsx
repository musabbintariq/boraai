import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBrands } from "@/hooks/useBrands";
import { useBrandContext } from "@/contexts/BrandContext";
import { useNavigate } from "react-router-dom";

export const UserProfileHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { brands } = useBrands();
  const { selectedBrandId, setSelectedBrandId } = useBrandContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return null;
  }

  const displayName = profile.full_name || profile.display_name || user.email?.split('@')[0] || 'User';
  const planDisplay = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <p className="text-sm font-medium">
          Hi, {displayName}
        </p>
        <Badge variant="secondary" className="w-fit text-xs">
          {planDisplay}
        </Badge>
      </div>
      
      {brands.length > 0 && (
        <Select value={selectedBrandId || ""} onValueChange={setSelectedBrandId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.brand_id} value={brand.brand_id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};