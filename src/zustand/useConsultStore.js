import { create } from "zustand";
import { mockConsults } from "../mocks/lawyer/mockConsults";

export const useConsultStore = create((set, get) => ({
  consults: mockConsults,

  addConsult: (consult) =>
    set((state) => ({
      consults: [consult, ...state.consults],
    })),

  updateStatus: (id, status) =>
    set((state) => ({
      consults: state.consults.map((c) => (c.id === id ? { ...c, status } : c)),
    })),

  deleteConsult: (id) =>
    set((state) => ({
      consults: state.consults.filter((c) => c.id !== id),
    })),

  getConsultsByUser: (userId) =>
    get().consults.filter((c) => c.userId === userId),

  getConsultsByLawyer: (lawyerId) =>
    get().consults.filter((c) => c.lawyerId === lawyerId),
}));
