import { createContext } from "react";
export type UserMode = 'employer'|'seeker'
export const userMode =  createContext<UserMode>('seeker');
export const setUserMode = createContext<(value: UserMode) => void>(()=> {});
export type OpportunityType = 'job'|'volunteer';
export const opportunityTypeContext = createContext<OpportunityType>('job');
export const setOpportunityTypeContext = createContext<(value: OpportunityType) => void>(()=>{});

