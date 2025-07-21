import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { supabase } from '@/entrypoints/background'



 
function Auth() {
 
  return (
    <Card className='w-[300px] h-[150px] bg-[#1a1a1a] text-white'>
     <CardContent className='flex flex-col gap-6 items-center'>
      <Button className='cursor-pointer border-purple-950' variant={"outline"}>
        <a target='_blank' href='http://localhost:8080/auth'>
Login
        </a>
        </Button>
     </CardContent>
    </Card>
  )
}

export default Auth

