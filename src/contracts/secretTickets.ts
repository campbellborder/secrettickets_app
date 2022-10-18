import {
    ContractDefinition,
    ContractQueryRequest,
    ContractMessageRequest, 
    ContractMessageResponse,
    createContractClient,
    Context
  } from '@stakeordie/griptape.js';

  interface SecretTickets {
    deposit(amount: string): Promise<ContractMessageResponse<any>>;
    withdraw(amount: string): Promise<ContractMessageResponse<any>>;
    createEvent(price: string, max_tickets: string): Promise<ContractMessageResponse<any>>;
    buyTicket(event_id: string): Promise<ContractMessageResponse<any>>;
    verifyTicket(ticket_id: string): Promise<ContractMessageResponse<any>>;
    verifyGuest(ticket_id: string, secret: number): Promise<ContractMessageResponse<any>>;
    isSoldOut(event_id: string): Promise<{is_sold_out: boolean}>;
    balance(address: string): Promise<{balance: number}>;
    events(address: string): Promise<{events: number[]}>;
    tickets(address: string): Promise<{tickets: number[], events: number[]}>;
  }

  const contractDef: ContractDefinition = {
    queries: {
        eventSoldOut(_: Context, event_id: number) : ContractQueryRequest {
            return { event_sold_out: { event_id} };
        },
        balance(_: Context, address: string) : ContractQueryRequest {
          return { balance: { address } }
        },
        events(_: Context, address: string) : ContractQueryRequest {
          return { events: { address } }
        },
        tickets(_: Context, address: string) : ContractQueryRequest {
          return { tickets: { address } }
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
      createEvent(_: Context, price: string, max_tickets: string): ContractMessageRequest {
        const handleMsg = { create_event: { price, max_tickets} }
        return { handleMsg };
      },
      buyTicket(_: Context, event_id: string): ContractMessageRequest {
        const handleMsg = { buy_ticket: { event_id } };
        return { handleMsg };
      }
    }
  }


export const secretTickets = createContractClient<SecretTickets>({
  at: "secret1fq567acajzcmzt758htctvcf8sxysae7969se2",
  definition: contractDef
});