'use client'

import { getShipwrecks, getShipwreck, deleteShipwreck, createShipwreck, editShipwreck } from "@/lib/db";
import { dashboardFields, createShipwreckFields, sortByFields, filterFields } from "@/lib/fields";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash, X, ListFilter } from "lucide-react";

export default function DashboardClient({ shipwrecks }: { shipwrecks: any[] }) { // fix for type error right now
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sortBy') || 'ship_name';
  
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [editedId, setEditedId] = useState(-1)
    const [editedShipwreck, setEditedShipwreck] = useState<any>(null);

    const [submitError, setSubmitError] = useState(false);

    async function handleOpenEditModal(id: number) {
        const result = await getShipwreck(id);
        setEditedShipwreck(result[0]);
        setEditedId(id);
        setEditModalOpen(true);
    }

    const handleSort = (field: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set('sortBy', field);
        router.push(`/dashboard?${params.toString()}`);
    };

    async function handleFilter(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const params = new URLSearchParams();

        params.set('sortBy', currentSort);

        const name = formData.get('ship_name')?.toString().trim();
        const yearStart = formData.get('year_built_range_start')?.toString().trim();
        const yearEnd = formData.get('year_built_range_end')?.toString().trim();

        if (name) params.set('ship_name', name);
        if (yearStart) params.set('year_start', yearStart);
        if (yearEnd) params.set('year_end', yearEnd);

        console.log({name, yearStart, yearEnd})

        router.push(`/dashboard?${params.toString()}`);
        setFilterModalOpen(false);
    }

    async function handleCreateShipwreck(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
    
      const form = e.currentTarget;
      const formData = new FormData(form);
    
      const hasValue = Array.from(formData.values()).some((value) => value.toString().trim() !== '');
    
      if (!hasValue) {
        setSubmitError(true);
        return;
      }
      setSubmitError(false);
      await createShipwreck(formData);
      router.refresh();
      setCreateModalOpen(false);
      form.reset();
    }

    async function handleEditShipwreck(id: number, e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
      const form = e.currentTarget;
      const formData = new FormData(form);
    
      const hasValue = Array.from(formData.values()).some((value) => value.toString().trim() !== '');

      if (!hasValue) {
        setSubmitError(true);
        return;
      }

      setSubmitError(false);
      await editShipwreck(id, formData);
      router.refresh();
      setEditModalOpen(false);
      setEditedId(-1);
      setEditedShipwreck(null);
      form.reset();
    }

async function handleDelete(id: number) {
    const confirmed = confirm("Are you sure you want to delete this shipwreck?");
    if (!confirmed) return;

    try {
        await deleteShipwreck(id);
        router.refresh();
    } catch (error) {
        console.error("Failed to delete shipwreck:", error);
    }
}
  
  return (
      <div className="flex flex-col min-h-screen justify-start font-sans bg-[#253f4b] pt-8 pb-8">
        <div className="flex justify-between items-center w-full p-4">
            <strong className="text-xl text-white">Shipwreck Dashboard</strong>
                <div className="flex items-center gap-4">
                    <select
                        value={currentSort}
                        onChange={(e) => handleSort(e.target.value)}
                        className="bg-transparent text-white border border-white rounded px-2 py-1 text-sm"
                    >
                        {sortByFields.map((field) => (
                            <option key={field.value} value={field.value} className="text-black">{field.label}</option>
                        ))}

                    </select>
                    <button
                        className=""
                        onClick={() => { setFilterModalOpen(true) }}>
                        <ListFilter className="w-5 h-5 text-white" />
                    </button>
                    <button
                        className=""
                        onClick={() => { setCreateModalOpen(true) }}>
                        <Plus className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>  
            
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl max-w-md w-full p-6 relative overflow-y-auto max-h-[75vh]">
                    <div className="p-4">
                    <button
                      className="absolute top-4 right-6"
                      onClick={() => setCreateModalOpen(false)}
                    >
                      <X className="h-5 w-5 text-[#253f4b]" />
                    </button>
                    <h2 className="text-xl text-[#253f4b] mb-4">Add a Shipwreck</h2>
                        <form 
                          onSubmit={handleCreateShipwreck}
                          onChange={() => {
                            setSubmitError(false)
                          }} 
                          className="flex flex-col space-y-4">
                          {createShipwreckFields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                              <label className="text-[#253f4b] mb-1">{field.placeholder}</label>
                              <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                className="border border-[#253f4b] rounded px-4 py-2 text-[#253f4b] bg-transparent"
                              />
                            </div>
                          ))}   
                          <div className="flex flex-col items-center justify-center mt-4">
                            {submitError &&
                                <div className="mb-4 text-red text-md">
                                Fill out at least one field to submit
                              </div>
                              }
                          <button 
                          type="submit" className='bg-blue-500 text-white rounded px-6 py-2'>
                            Save
                          </button>
                        </div> 
                        </form>
                      </div> 
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl max-w-md w-full p-6 relative overflow-y-auto max-h-[75vh]">
                    <div className="p-4">
                    <button
                      className="absolute top-4 right-6"
                      onClick={() => setEditModalOpen(false)}
                    >
                      <X className="h-5 w-5 text-[#253f4b]" />
                    </button>
                    <h2 className="text-xl text-[#253f4b] mb-4">Edit Shipwreck</h2>
                        <form 
                            key={editedId}
                          onSubmit={(e) => handleEditShipwreck(editedId, e)}
                          onChange={() => {
                            setSubmitError(false)
                          }} 
                          className="flex flex-col space-y-4">
                          {createShipwreckFields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                              <label className="text-[#253f4b] mb-1">{field.placeholder}</label>
                              <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                defaultValue={editedShipwreck?.[field.name] ?? ''}
                                className="border border-[#253f4b] rounded px-4 py-2 text-[#253f4b] bg-transparent"
                              />
                            </div>
                          ))}   
                          <div className="flex flex-col items-center justify-center mt-4">
                            {submitError &&
                                <div className="mb-4 text-red text-md">
                                Fill out at least one field to submit
                              </div>
                              }
                          <button 
                          type="submit" className='bg-blue-500 text-white rounded px-6 py-2'>
                            Save
                          </button>
                        </div> 
                        </form>
                      </div> 
                    </div>
                </div>
            )}

            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl max-w-xs w-full p-6 relative overflow-y-auto max-h-[75vh]">
                    <div className="p-4">
                    <button
                      className="absolute top-4 right-6"
                      onClick={() => setFilterModalOpen(false)}
                    >
                      <X className="h-5 w-5 text-[#253f4b]" />
                    </button>
                    <h2 className="text-xl text-[#253f4b] mb-4">Filter</h2>
                        <form 
                          onSubmit={handleFilter}
                          className="flex flex-col space-y-4">
                          {filterFields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                              <label className="text-[#253f4b] mb-1">{field.label}</label>
                              <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                defaultValue={searchParams.get(field.name) ?? ''}
                                className="border border-[#253f4b] rounded px-4 py-2 text-[#253f4b] bg-transparent"
                              />
                            </div>
                          ))}   
                          <div className="flex flex-col items-center justify-center mt-4">
                          <button 
                          type="submit" className='bg-blue-500 text-white rounded px-6 py-2'>
                            Save Filters
                          </button>
                        </div> 
                        </form>
                      </div> 
                    </div>
                </div>
            )}

      <div className="flex flex-col max-h-[75vh] w-full overflow-y-auto p-4">
        {shipwrecks.length === 0 &&
            <h2 className="text-md text-white mb-4">No shipwrecks with this criteria</h2>
        }
          {shipwrecks.map((ship) => (
            <div key={ship.id} className="bg-white p-4 border rounded-xl mb-4">
                <div className="flex justify-between items-center w-full">
                    <strong className="text-xl flex-1">{ship.ship_name}</strong>
                    <div className="flex gap-1">
                        <button 
                        className="p-2"
                        onClick={() => handleOpenEditModal(ship.id)}>
                        <Pencil className="w-5 h-5 text-[#253f4b]" />
                        </button>
                        <button 
                        className="p-2"
                        onClick={() => { handleDelete(ship.id) }}>
                        <Trash className="w-5 h-5 text-[#253f4b]" />
                        </button>
                    </div>
                    </div>
              {dashboardFields.map(({ key, label }) => {
              const value = ship[key];
              if (value == null || String(value).trim() === "") return null;
              return (
                <div key={key}>
                  {label}: {value}
                </div>
              )
            })}
            </div>
          ))}
      </div>
      </div>
  );
}
