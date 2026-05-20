"use client"
import { useUser } from '@/context/AuthContext';
import React from 'react';

const Logout = () => {
    const { logout } = useUser()
    return (
        <div>
            <button className=' bg-zinc-300 hover:bg-neutral-200 hover:scale-95 text-black w-full rounded-sm' onClick={logout}>Logout</button>
        </div>
    );
};

export default Logout;