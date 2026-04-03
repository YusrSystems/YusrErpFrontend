import TripsApiService from "@/app/core/networking/tripsApiService";
import type { SeatType } from "@/app/features/trips/bus/busTypes";
import { Deposit } from "@/app/features/trips/data/deposit";
import { Ticket } from "@/app/features/trips/data/ticket";
import type { Trip } from "@/app/features/trips/data/trip";
import { type ValidationRule, Validators } from "@yusr_systems/core";
import { useEntityForm } from "@yusr_systems/ui";
import { useEffect, useState } from "react";
import { useAppSelector } from "../state/store";

export function useTripForm(entity: Trip | undefined, mode: string)
{
  const validationRules: ValidationRule<Partial<Trip>>[] = [{
    field: "mainCaptainName",
    selector: (d) => d.mainCaptainName,
    validators: [Validators.required("يرجى إدخال اسم قائد الحافلة")]
  }, {
    field: "startDate",
    selector: (d) => d.startDate,
    validators: [Validators.required("يرجى إدخال تاريخ ووقت التحرك")]
  }, {
    field: "ticketPrice",
    selector: (d) => d.ticketPrice,
    validators: [Validators.required("يرجى إدخال سعر التذكرة")]
  }, { field: "routeId", selector: (d) => d.routeId, validators: [Validators.required("يرجى تحديد خط السفر")] }];
  const { formData, handleChange, errorInputClass, getError, isInvalid, clearError, validate } = useEntityForm<Trip>(
    entity,
    validationRules
  );
  const [movingTicket, setMovingTicket] = useState<Ticket | undefined>(undefined);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>(undefined);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | undefined>(undefined);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);
      new TripsApiService().Get(entity.id).then((res) =>
      {
        if (res.data)
        {
          handleChange({ ...res.data, startDate: res.data.startDate ? new Date(res.data.startDate) : undefined });
        }

        setInitLoading(false);
      });
    }
    else
    {
      handleChange({ branchId: authState.loggedInUser?.branchId });
    }
  }, [entity?.id, mode]);

  const updateTicketChair = (ticketId: number | undefined, chairNo: number, newSeatId: number) =>
  {
    handleChange((prev) => ({
      ...prev,
      tickets: prev.tickets?.map((t) =>
        (t.id === ticketId && t.id !== undefined) || t.chairNo === chairNo ? { ...t, chairNo: newSeatId } : t
      )
    }));
    setMovingTicket(undefined);
  };

  const handleSeatClick = (seat: SeatType) =>
  {
    // 1. Move Logic
    if (movingTicket)
    {
      const isOccupied = formData.tickets?.some((t) => t.chairNo === seat.id);
      if (!isOccupied)
      {
        updateTicketChair(movingTicket.id, movingTicket.chairNo, seat.id);
      }
      else
      {
        setMovingTicket(undefined);
      }
      return;
    }

    // 2. Open Ticket Logic
    let ticket = formData.tickets?.find((t) => t.chairNo === seat.id);
    if (!ticket)
    {
      ticket = new Ticket({
        chairNo: seat.id,
        fromCityId: formData.route?.fromCityId,
        fromCityName: formData.route?.fromCityName,
        toCityId: formData.route?.toCityId,
        toCityName: formData.route?.toCityName,
        issueCityId: formData.route?.fromCityId,
        issueCityName: formData.route?.fromCityName,
        issueDate: new Date(),
        amount: formData.ticketPrice,
        paidAmount: formData.ticketPrice
      });
    }
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
  };

  const handleTicketUpdate = (updatedTicket: Ticket) =>
  {
    handleChange((prev) =>
    {
      const tickets = [...(prev.tickets || [])];
      const index = tickets.findIndex((t) => t.chairNo === updatedTicket.chairNo);

      if (index > -1)
      {
        tickets[index] = updatedTicket;
      }
      else
      {
        tickets.push(updatedTicket);
      }

      return { ...prev, tickets };
    });

    setIsTicketDialogOpen(false);
  };

  const handleTicketCheckInUpdate = (ticketId: number) =>
  {
    handleChange((prev) => ({
      ...prev,
      tickets: prev.tickets?.map((t) => t.id === ticketId ? { ...t, checkedIn: true } : t)
    }));
  };

  const handleDepositOpen = (deposit: Deposit | undefined) =>
  {
    if (deposit == undefined)
    {
      deposit = new Deposit({
        fromCityId: formData.route?.fromCityId,
        fromCityName: formData.route?.fromCityName,
        toCityId: formData.route?.toCityId,
        toCityName: formData.route?.toCityName,
        amount: formData.ticketPrice,
        paidAmount: formData.ticketPrice
      });
    }
    setSelectedDeposit(deposit);
    setIsDepositDialogOpen(true);
  };

  return {
    formData,
    handleChange,
    movingTicket,
    setMovingTicket,
    validate,
    initLoading,
    isInvalid,
    getError,
    clearError,
    errorInputClass,
    handleSeatClick,
    handleTicketUpdate,
    handleTicketCheckInUpdate,
    handleDepositOpen,
    selectedTicket,
    setSelectedTicket,
    selectedDeposit,
    setSelectedDeposit,
    isTicketDialogOpen,
    setIsTicketDialogOpen,
    isDepositDialogOpen,
    setIsDepositDialogOpen
  };
}
