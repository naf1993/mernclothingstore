import React from 'react'
import { BsDoorOpen } from "react-icons/bs"
import {SlRefresh} from 'react-icons/sl'
import {SlPlane} from 'react-icons/sl'
import { Link } from 'react-router-dom'
import {AiOutlineCustomerService} from 'react-icons/ai'

const Policy = () => {
  return (
    <div className='policy-wrapper'>
        <div className='item'>
            <div className='icon-box'>
                <BsDoorOpen className='iconbox-icon' />
            </div>
            <div className='text-box'>
                <p className='text-policy'>Cash On Delivery</p>
            </div>
        </div>
        <div className='item'>
            <div className='icon-box'>
                <SlRefresh className='iconbox-icon' />
            </div>
            <div className='text-box'>
                <p className='text-policy'>Easy Return</p>
            </div>
        </div>
        <div className='item'>
            <div className='icon-box'>
                <SlPlane className='iconbox-icon' />
            </div>
            <div className='text-box'>
                <p className='text-policy'>
                    World Wide Shippping
                </p>
                <Link to="/products" className="site-title">
        Site Name
      </Link>
            </div>
        </div>
        <div className='item'>
            <div className='icon-box'>
                <AiOutlineCustomerService className='iconbox-icon' />
            </div>
            <div className='text-box'>
                <p className='text-policy'>24x7 Service</p>
            </div>
        </div>
        {/* <BsDoorOpen />
        <SlRefresh />
        <SlPlane />
        <AiOutlineCustomerService /> */}
    </div>
  )
}

export default Policy