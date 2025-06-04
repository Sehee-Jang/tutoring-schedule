"use client";

import { useState } from "react";
// import { Button } from "../ui/button";
import Button from "../../components/shared/Button";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";

type DeleteAlertDialogProps = {
  onConfirm: () => Promise<void>;
  triggerLabel?: React.ReactNode;
  triggerClassName?: string;
  triggerSize?: "sm" | "md" | "lg";
};

export function DeleteAlertDialog({
  onConfirm,
  triggerLabel = "삭제",
  triggerClassName = "",
  triggerSize = "sm",
}: DeleteAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='warning'
          size={triggerSize ?? "sm"}
          className={triggerClassName}
          disabled={isLoading}
        >
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 삭제된 데이터는 복구할 수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant='outline' disabled={isLoading}>
              취소
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleDelete}
              size={triggerSize ?? "sm"}
              variant='warning'
              disabled={isLoading}
            >
              {isLoading ? "삭제 중..." : "삭제"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
