"use client"
import React from 'react'
import Snowfall from 'react-snowfall'

const Snow = () => {
  return (
    <div className='w-full h-full'>
      <Snowfall

      //   color="red"
      snowflakeCount={10}
      />
    </div>
  )
}

export default Snow