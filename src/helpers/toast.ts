import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

export function showErrorToast(message: string) {
  toast({
    duration: 4000,
    variant: 'destructive',
    description: message,
  })
}

export function showSuccessToast(message: string) {
  toast({
    duration: 4000,
    description: message,
  })
}
