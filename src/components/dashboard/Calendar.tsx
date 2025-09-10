import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location?: string;
  attendees?: number;
  type: 'meeting' | 'event' | 'deadline' | 'reminder';
}

const DashboardCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync',
      date: new Date(),
      time: '10:00 AM',
      location: 'Conference Room A',
      attendees: 8,
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Submit final project deliverables',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '5:00 PM',
      type: 'deadline'
    },
    {
      id: '3',
      title: 'Client Presentation',
      description: 'Present Q4 results to client',
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: '2:00 PM',
      location: 'Client Office',
      attendees: 12,
      type: 'event'
    }
  ]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    location: '',
    type: 'meeting' as Event['type']
  });
  const [showAddEvent, setShowAddEvent] = useState(false);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500/20 text-blue-700 border-blue-200';
      case 'event': return 'bg-green-500/20 text-green-700 border-green-200';
      case 'deadline': return 'bg-red-500/20 text-red-700 border-red-200';
      case 'reminder': return 'bg-yellow-500/20 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) return;

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      time: newEvent.time,
      location: newEvent.location,
      type: newEvent.type
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      time: '',
      location: '',
      type: 'meeting'
    });
    setShowAddEvent(false);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </CardTitle>
          <CardDescription>
            Manage your schedule and upcoming events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              if (newDate) setSelectedDate(newDate);
            }}
            className="rounded-md border"
            modifiers={{
              hasEvents: (date) => getEventsForDate(date).length > 0
            }}
            modifiersStyles={{
              hasEvents: { 
                backgroundColor: 'hsl(var(--primary))', 
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Events for Selected Date */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for {selectedDate.toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Event description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="meeting">Meeting</option>
                        <option value="event">Event</option>
                        <option value="deadline">Deadline</option>
                        <option value="reminder">Reminder</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Event location"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddEvent(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddEvent}>
                      Add Event
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedDateEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No events scheduled for this date
              </p>
            ) : (
              selectedDateEvents.map((event) => (
                <div key={event.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                    {event.attendees && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCalendar;