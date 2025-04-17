"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface SmokingReasonDialogProps {
  isOpen: boolean
  onClose: (reason?: string) => void
}

export default function SmokingReasonDialog({ isOpen, onClose }: SmokingReasonDialogProps) {
  const [reason, setReason] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      // Focus the textarea when the dialog opens
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSubmit = () => {
    onClose(reason.trim() || undefined)
    setReason("") // Reset for next time
  }

  const handleSkip = () => {
    onClose()
    setReason("") // Reset for next time
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Why did you smoke?</DialogTitle>
          <DialogDescription>Understanding your triggers can help you quit. This is optional.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            ref={textareaRef}
            placeholder="I smoked because..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSkip} className="sm:w-auto w-full">
            Skip
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 sm:w-auto w-full">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
