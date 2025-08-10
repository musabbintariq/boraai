import { SimplifiedStrategyModal } from "./simplified/SimplifiedStrategyModal";

interface StrategyLabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StrategyLabModal({ open, onOpenChange }: StrategyLabModalProps) {
  return <SimplifiedStrategyModal open={open} onOpenChange={onOpenChange} />;
}