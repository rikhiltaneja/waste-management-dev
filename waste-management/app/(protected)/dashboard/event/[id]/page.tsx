"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SideBarLayout from '@/components/sidebar/sidebar-layout'
import { ArrowLeft, MapPin, Calendar, Clock, Users2, Edit, Trash2, UserCheck, Download, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'


interface PhysicalTrainingEvent {
  id: number
  title: string
  description: string
  startDateTime: string
  endDateTime?: string
  location: string
  maxCapacity?: number
  targetAudience: string[]
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'DRAFT'
  createdAt: string
  registrations: number
  imageUrl?: string
  locality?: {
    name: string
  }
}

interface Registration {
  id: number
  userName: string
  userEmail: string
  registeredAt: string
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
}

const EventDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const eventId = parseInt(params.id as string)
  
  const [event, setEvent] = useState<PhysicalTrainingEvent | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEdit = () => {
    // Navigate to edit mode or open edit modal
    console.log('Edit event:', eventId)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        // API call to delete event
        // await deleteEvent(eventId)
        router.push('/dashboard/event')
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const handleExportRegistrations = () => {
    // Export registrations to CSV
    console.log('Export registrations for event:', eventId)
  }

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockEvents: PhysicalTrainingEvent[] = [
      {
        id: 1,
        title: "Recycling Workshop",
        description: "Lorem ipsum dolor sit amet consectetur. In ridiculus nec Lorem ipsum dolor sit amet consectetur. In ridiculus nec. This comprehensive workshop will cover various aspects of recycling including proper sorting techniques, understanding recycling symbols, and the environmental impact of recycling. Participants will learn hands-on methods for setting up recycling systems in their homes and communities.",
        startDateTime: "2025-11-28T10:00:00Z",
        endDateTime: "2025-11-28T12:00:00Z",
        location: "Delhi, India",
        maxCapacity: 50,
        targetAudience: ["CITIZEN", "WORKER"],
        status: "ACTIVE",
        createdAt: "2024-01-01T00:00:00Z",
        registrations: 35,
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop",
        locality: { name: "Central Delhi" }
      },
      {
        id: 2,
        title: "Waste Segregation Training",
        description: "Learn proper waste segregation techniques for better waste management",
        startDateTime: "2024-01-15T10:00:00Z",
        endDateTime: "2024-01-15T12:00:00Z",
        location: "Jalandhar",
        maxCapacity: 50,
        targetAudience: ["CITIZEN", "WORKER"],
        status: "COMPLETED",
        createdAt: "2024-01-01T00:00:00Z",
        registrations: 45,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
        locality: { name: "Downtown" }
      },
      {
        id: 3,
        title: "Composting Workshop",
        description: "Hands-on composting techniques for households and community gardens",
        startDateTime: "2024-01-20T14:00:00Z",
        endDateTime: "2024-01-20T16:00:00Z",
        location: "Green Park",
        maxCapacity: 30,
        targetAudience: ["CITIZEN"],
        status: "DRAFT",
        createdAt: "2024-01-02T00:00:00Z",
        registrations: 0,
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
        locality: { name: "Uptown" }
      }
    ]

    const mockRegistrations: Registration[] = [
      {
        id: 1,
        userName: "John Doe",
        userEmail: "john.doe@example.com",
        registeredAt: "2024-01-10T09:00:00Z",
        status: "CONFIRMED"
      },
      {
        id: 2,
        userName: "Jane Smith",
        userEmail: "jane.smith@example.com",
        registeredAt: "2024-01-11T14:30:00Z",
        status: "CONFIRMED"
      },
      {
        id: 3,
        userName: "Mike Johnson",
        userEmail: "mike.johnson@example.com",
        registeredAt: "2024-01-12T11:15:00Z",
        status: "PENDING"
      }
    ]
    
    setTimeout(() => {
      const foundEvent = mockEvents.find(e => e.id === eventId)
      setEvent(foundEvent || null)
      setRegistrations(mockRegistrations)
      setLoading(false)
    }, 100)
  }, [eventId])

  if (loading) {
    return (
      <SideBarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading event details...</div>
        </div>
      </SideBarLayout>
    )
  }

  if (!event) {
    return (
      <SideBarLayout>
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <div className="text-lg font-medium text-gray-900 text-center">Event not found</div>
          <p className="text-gray-500 mt-2 text-center">The event you're looking for doesn't exist.</p>
          <Button 
            onClick={() => router.push('/dashboard/event')} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </SideBarLayout>
    )
  }

  return (
    <SideBarLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/event')}
              className="p-2 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">{event.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  Created {formatDate(event.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" onClick={handleEdit} className="flex-1 sm:flex-none">
              <Edit className="h-4 w-4 mr-2" />
              <span className="sm:inline">Edit</span>
            </Button>
            <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 flex-1 sm:flex-none">
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="sm:inline">Delete</span>
            </Button>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Event Information */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Event Image */}
            {event.imageUrl && (
              <Card className="overflow-hidden lg:col-span-3">
                <div className="relative h-48 sm:h-64 md:h-80">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </Card>
            )}

            {/* Description */}
            <div className='grid grid-cols-3 gap-6'>
            <Card className="p-4 sm:p-6 col-span-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Event Description</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{event.description}</p>
            </Card>

            {/* Schedule & Location */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Schedule & Location</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">Start Date</div>
                    <div className="text-gray-600 text-sm break-words">{formatDate(event.startDateTime)}</div>
                  </div>
                </div>
                
                {event.endDateTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">End Date</div>
                      <div className="text-gray-600 text-sm break-words">{formatDate(event.endDateTime)}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">Location</div>
                    <div className="text-gray-600 text-sm break-words">{event.location}</div>
                    {event.locality && (
                      <div className="text-xs sm:text-sm text-gray-500">{event.locality.name}</div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
   
            {/* Registrations */}
            <Card className="p-4 sm:p-6 col-span-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Registrations</h2>
                <Button variant="outline" size="sm" onClick={handleExportRegistrations} className="w-fit">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Email</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Registered</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {registrations.map((registration) => (
                        <tr key={registration.id}>
                          <td className="px-3 sm:px-4 py-3">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                              {registration.userName}
                            </div>
                            <div className="text-xs text-gray-600 sm:hidden truncate max-w-[120px]">
                              {registration.userEmail}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                            <div className="truncate max-w-[200px]">{registration.userEmail}</div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                            {formatDate(registration.registeredAt)}
                          </td>
                          <td className="px-3 sm:px-4 py-3">
                            <span 
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                registration.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                registration.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {registration.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
 {/* Quick Stats */}
            <Card className="p-4 sm:p-6 col-span-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Stats</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">Registrations</span>
                  </div>
                  <span className="font-medium text-sm sm:text-base">
                    {event.registrations}/{event.maxCapacity || '∞'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600">Capacity</span>
                  </div>
                  <span className="font-medium text-sm sm:text-base">
                    {event.maxCapacity ? 
                      `${Math.round((event.registrations / event.maxCapacity) * 100)}% full` : 
                      'No limit'
                    }
                  </span>
                </div>
              </div>
            </Card>

            {/* Target Audience */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Target Audience</h2>
              <div className="flex flex-wrap gap-2">
                {event.targetAudience.map((audience) => (
                  <span key={audience} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {audience}
                  </span>
                ))}
              </div>
            </Card>
          </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Event Image Thumbnail (for events without main image) */}
            {!event.imageUrl && (
              <Card className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Event Image</h2>
                <div className="flex items-center justify-center h-24 sm:h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500">No image uploaded</p>
                  </div>
                </div>
              </Card>
            )}

        
          </div>
        </div>
      </div>
    </SideBarLayout>
  )
}

export default EventDetailPage