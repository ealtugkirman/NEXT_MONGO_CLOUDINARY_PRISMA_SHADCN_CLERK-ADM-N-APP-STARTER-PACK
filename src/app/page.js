
import React from "react";
import Sidebar from "./_components/Sidebar";
import AdminCard from "./_components/AdminCard"


export default function Home() {
  return (
    <div className="flex bg-gray-50 flex-row">
      <Sidebar />
      <div className="w-96 h-screen hidden lg:flex" />
      <div className="px-4 py-12 mx-auto flex flex-col">
        <div>
          <h1 className="text-black text-4xl font-semibold">Koleksiyonlar</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 py-12">
          <AdminCard href="/admin/blog" title="Blog" />
        </div>
      </div>
    </div>  );
}
