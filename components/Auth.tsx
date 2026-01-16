import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { supabase } from '@/entrypoints/background'




function Auth() {

  return (
    <Card className='w-[300px] h-[150px] bg-card text-card-foreground'>
      <CardContent className='flex flex-col gap-6 items-center'>
        <Button className='cursor-pointer border-border' variant={"outline"}>
          <a target='_blank' href='https://algo-gray.vercel.app/auth'>
            Login
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

export default Auth

