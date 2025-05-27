"use client"
import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import AddServiceDialog from './AddServiceDialog'

function ServiceHeader() {
    const [isOpen, setIsOpen]=useState<boolean>(false)
  return (
    <div>
       <div className="flex justify-between items-center mb-6">
            <h2 className='text-xl lg:text-2xl font-medium text-headerColor '>Our Services</h2>
            <button onClick={()=>setIsOpen(true)} className="flex items-center gap-1 bg-primaryColor cursor-pointer text-white px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium">
            <FiPlus size={18} /> Add New
            </button>
          </div>

          {
            isOpen && <AddServiceDialog open={isOpen} onClose={setIsOpen}/>
          }
    </div>
  )
}

export default ServiceHeader
