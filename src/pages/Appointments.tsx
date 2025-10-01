import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Clock, User, Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      clientName: 'João Silva',
      service: 'Consulta Geral',
      time: '09:00',
      duration: 60,
      status: 'confirmado',
      date: new Date(),
    },
    {
      id: 2,
      clientName: 'Maria Santos',
      service: 'Especialista',
      time: '10:30',
      duration: 90,
      status: 'pendente',
      date: new Date(),
    },
    {
      id: 3,
      clientName: 'Pedro Costa',
      service: 'Retorno',
      time: '14:00',
      duration: 30,
      status: 'confirmado',
      date: addDays(new Date(), 1),
    },
  ];

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 0 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 0 }),
  });

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(direction === 'prev' ? subWeeks(currentWeek, 1) : addWeeks(currentWeek, 1));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setSelectedDate(direction === 'prev' ? addDays(selectedDate, -1) : addDays(selectedDate, 1));
    } else if (viewMode === 'week') {
      navigateWeek(direction);
    } else {
      setCurrentWeek(direction === 'prev' ? 
        new Date(currentWeek.getFullYear(), currentWeek.getMonth() - 1, 1) :
        new Date(currentWeek.getFullYear(), currentWeek.getMonth() + 1, 1)
      );
    }
  };

  const getDisplayDates = () => {
    if (viewMode === 'day') {
      return [selectedDate];
    } else if (viewMode === 'week') {
      return weekDays;
    } else {
      const monthStart = startOfMonth(currentWeek);
      const monthEnd = endOfMonth(currentWeek);
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie seus compromissos e horários
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Novo Agendamento</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Mini Calendar Sidebar */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-center">Calendário</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0 p-0 mx-auto"
                classNames={{
                  months: "flex flex-col space-y-4 w-full",
                  month: "space-y-4 w-full flex flex-col items-center",
                  caption: "flex justify-center pt-1 relative items-center w-full",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1 mx-auto",
                  head_row: "flex justify-center w-full",
                  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[11px] flex items-center justify-center",
                  row: "flex w-full mt-2 justify-center",
                  cell: "h-8 w-8 text-center text-xs p-0 relative focus-within:relative focus-within:z-20 flex items-center justify-center",
                  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md flex items-center justify-center",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                }}
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Agendados</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confirmados</span>
                <span className="font-medium text-green-600">6</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pendentes</span>
                <span className="font-medium text-yellow-600">2</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Calendar View */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-col gap-4 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDate('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDate('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <h2 className="text-sm sm:text-lg font-semibold ml-2">
                    {viewMode === 'day' 
                      ? format(selectedDate, "dd 'de' MMM, yyyy", { locale: ptBR })
                      : viewMode === 'week'
                      ? `${format(weekDays[0], "dd MMM", { locale: ptBR })} - ${format(weekDays[6], "dd MMM", { locale: ptBR })}`
                      : format(currentWeek, "MMMM yyyy", { locale: ptBR })
                    }
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar agendamentos..."
                      className="pl-8 w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={viewMode} onValueChange={(value: 'day' | 'week' | 'month') => setViewMode(value)}>
                    <SelectTrigger className="w-24 sm:w-32 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Dia</SelectItem>
                      <SelectItem value="week">Semana</SelectItem>
                      <SelectItem value="month">Mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Calendar View */}
              <div className="border-t">
                {viewMode === 'day' && (
                  <div>
                    {/* Day View Header */}
                    <div className="grid grid-cols-2 border-b bg-muted/50">
                      <div className="p-3 border-r">
                        <div className="text-sm font-medium">
                          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-sm text-muted-foreground">
                          {filteredAppointments.filter(apt => isSameDay(apt.date, selectedDate)).length} agendamentos
                        </div>
                      </div>
                    </div>
                    
                    {/* Day Time Slots */}
                    <div className="max-h-96 overflow-y-auto">
                      {timeSlots.slice(8, 20).map((time) => {
                        const dayAppointments = filteredAppointments.filter(apt =>
                          isSameDay(apt.date, selectedDate) && apt.time === time
                        );
                        
                        return (
                          <div key={time} className="grid grid-cols-2 border-b min-h-[60px]">
                            <div className="p-3 text-sm text-muted-foreground border-r bg-muted/20 flex items-start">
                              {time}
                            </div>
                            <div className="p-2 relative">
                              {dayAppointments.map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className="bg-primary/10 border border-primary/20 rounded p-2 mb-2 cursor-pointer hover:bg-primary/20 transition-colors"
                                >
                                  <div className="font-medium text-primary mb-1">
                                    {appointment.clientName}
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-1">
                                    {appointment.service}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getStatusColor(appointment.status)}`}
                                    >
                                      {appointment.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {appointment.duration}min
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {dayAppointments.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                  Nenhum agendamento neste horário
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {viewMode === 'week' && (
                  <div>
                    {/* Week Days Header */}
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-8 border-b min-w-[600px]">
                        <div className="p-2 border-r bg-muted/50"></div>
                        {weekDays.map((day) => (
                          <div key={day.toISOString()} className="p-2 text-center border-r bg-muted/50">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">
                              {format(day, 'EEE', { locale: ptBR })}
                            </div>
                            <div className={`text-sm font-medium ${
                              isSameDay(day, new Date()) 
                                ? 'text-primary font-bold' 
                                : ''
                            }`}>
                              {format(day, 'd')}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Week Time Slots */}
                      <div className="max-h-96 overflow-y-auto min-w-[600px]">
                        {timeSlots.slice(8, 20).map((time) => (
                          <div key={time} className="grid grid-cols-8 border-b min-h-[60px]">
                            <div className="p-2 text-xs text-muted-foreground border-r bg-muted/20 flex items-start justify-end">
                              {time}
                            </div>
                            {weekDays.map((day) => {
                              const dayAppointments = filteredAppointments.filter(apt =>
                                isSameDay(apt.date, day) && apt.time === time
                              );
                              
                              return (
                                <div key={`${day.toISOString()}-${time}`} className="p-1 border-r relative">
                                  {dayAppointments.map((appointment) => (
                                    <div
                                      key={appointment.id}
                                      className="bg-primary/10 border border-primary/20 rounded p-1 mb-1 text-xs cursor-pointer hover:bg-primary/20 transition-colors overflow-hidden"
                                    >
                                      <div className="font-medium text-primary truncate text-[10px]">
                                        {appointment.clientName}
                                      </div>
                                      <div className="text-muted-foreground truncate text-[9px]">
                                        {appointment.service}
                                      </div>
                                      <div className="flex justify-center mt-0.5">
                                        <Badge 
                                          variant="outline" 
                                          className={`text-[8px] px-1 py-0 h-4 ${getStatusColor(appointment.status)}`}
                                        >
                                          {appointment.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === 'month' && (
                  <div>
                    {/* Month View */}
                    <div className="grid grid-cols-7 gap-px bg-border">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="p-2 text-center text-xs font-medium bg-muted text-muted-foreground">
                          {day}
                        </div>
                      ))}
                      
                      {getDisplayDates().map((date) => {
                        const dateAppointments = filteredAppointments.filter(apt => isSameDay(apt.date, date));
                        const isToday = isSameDay(date, new Date());
                        
                        return (
                          <div 
                            key={date.toISOString()} 
                            className={`min-h-[100px] p-1 bg-background cursor-pointer hover:bg-muted/50 transition-colors ${
                              isToday ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => {
                              setSelectedDate(date);
                              setViewMode('day');
                            }}
                          >
                            <div className={`text-sm font-medium mb-1 ${
                              isToday ? 'text-primary font-bold' : ''
                            }`}>
                              {format(date, 'd')}
                            </div>
                            <div className="space-y-1">
                              {dateAppointments.slice(0, 3).map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className="text-xs p-1 bg-primary/10 border border-primary/20 rounded truncate"
                                >
                                  <div className="font-medium text-primary">
                                    {appointment.time}
                                  </div>
                                  <div className="text-muted-foreground truncate">
                                    {appointment.clientName}
                                  </div>
                                </div>
                              ))}
                              {dateAppointments.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  +{dateAppointments.length - 3} mais
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;