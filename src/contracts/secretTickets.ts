import {
    ContractDefinition,
    ContractQueryRequest,
    ContractMessageRequest, 
    ContractMessageResponse,
    createContractClient,
    Context
  } from '@stakeordie/griptape.js';
import { UIValueString } from '@testing-library/user-event/dist/types/document/UI';

  interface SecretTickets {
    deposit(amount: string): Promise<ContractMessageResponse<any>>;
    withdraw(amount: string): Promise<ContractMessageResponse<any>>;
    createEvent(price: string, max_tickets: string): Promise<ContractMessageResponse<any>>;
    buyTicket(event_id: string): Promise<ContractMessageResponse<any>>;
    verifyTicket(ticket_id: string): Promise<ContractMessageResponse<any>>;
    verifyGuest(ticket_id: string, secret: number): Promise<ContractMessageResponse<any>>;
    isSoldOut(event_id: string): Promise<{is_sold_out: boolean}>;
    balance(address: string): Promise<{balance: number}>;
  }

  const contractDef: ContractDefinition = {
    queries: {
        eventSoldOut(_: Context, event_id: number) : ContractQueryRequest {
            return { event_sold_out: { event_id} };
        },
        balance(_: Context, address: string) : ContractQueryRequest {
          return { balance: { address }}
        }
    },

    messages: {
      deposit(_: Context, amount: string): ContractMessageRequest {
        const handleMsg = { deposit: {} };
        const transferAmount = {amount: amount, denom: "uscrt"};
        return { handleMsg, transferAmount };
      },
      withdraw(_: Context, amount: string): ContractMessageRequest {
        const handleMsg = { withdraw: { amount } };
        return { handleMsg };
      },
      createEvent(_: Context, price: string, max_tickets: number): ContractMessageRequest {
        const handleMsg = { create_event: { price, max_tickets} }
        return { handleMsg };
      }
    }
  }


export const secretTickets = createContractClient<SecretTickets>({
  at: "secret1h3dh4uf4ukxjyaudvj4t5ss3xnxp6e3gktrftj",
  definition: contractDef
});