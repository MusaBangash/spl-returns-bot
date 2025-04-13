import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ReturnRequest, ReturnItem } from '../types';
import { mockReturnRequests } from '../mock-data/data';
import { useAuth } from './AuthContext';

// Define the shape of the returns state
interface ReturnsState {
  returns: ReturnRequest[];
  currentReturn: ReturnRequest | null;
  isLoading: boolean;
  error: string | null;
}

// Define the context type
interface ReturnsContextType {
  returnsState: ReturnsState;
  createReturn: (returnData: Omit<ReturnRequest, 'id' | 'sapcNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateReturn: (returnId: string, updates: Partial<ReturnRequest>) => void;
  addReturnItem: (returnId: string, item: Omit<ReturnItem, 'productId'>) => void;
  removeReturnItem: (returnId: string, itemIndex: number) => void;
  getReturnById: (returnId: string) => ReturnRequest | undefined;
  setCurrentReturn: (returnId: string) => void;
  clearCurrentReturn: () => void;
}

// Create the context
const ReturnsContext = createContext<ReturnsContextType | undefined>(undefined);

// Action types for our reducer
type ReturnsAction =
  | { type: 'FETCH_RETURNS_START' }
  | { type: 'FETCH_RETURNS_SUCCESS'; payload: ReturnRequest[] }
  | { type: 'FETCH_RETURNS_FAILURE'; payload: string }
  | { type: 'CREATE_RETURN'; payload: ReturnRequest }
  | { type: 'UPDATE_RETURN'; payload: { returnId: string; updates: Partial<ReturnRequest> } }
  | { type: 'ADD_RETURN_ITEM'; payload: { returnId: string; item: ReturnItem } }
  | { type: 'REMOVE_RETURN_ITEM'; payload: { returnId: string; itemIndex: number } }
  | { type: 'SET_CURRENT_RETURN'; payload: ReturnRequest }
  | { type: 'CLEAR_CURRENT_RETURN' };

// Initial state
const initialState: ReturnsState = {
  returns: [],
  currentReturn: null,
  isLoading: false,
  error: null,
};

// Reducer function
const returnsReducer = (state: ReturnsState, action: ReturnsAction): ReturnsState => {
  switch (action.type) {
    case 'FETCH_RETURNS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_RETURNS_SUCCESS':
      return {
        ...state,
        returns: action.payload,
        isLoading: false,
      };
    case 'FETCH_RETURNS_FAILURE':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CREATE_RETURN':
      return {
        ...state,
        returns: [...state.returns, action.payload],
        currentReturn: action.payload,
      };
    case 'UPDATE_RETURN': {
      const { returnId, updates } = action.payload;
      const updatedReturns = state.returns.map(returnItem =>
        returnItem.id === returnId ? { ...returnItem, ...updates, updatedAt: new Date().toISOString() } : returnItem
      );
      
      // Also update currentReturn if it's the one being updated
      const updatedCurrentReturn = 
        state.currentReturn && state.currentReturn.id === returnId
          ? { ...state.currentReturn, ...updates, updatedAt: new Date().toISOString() }
          : state.currentReturn;
          
      return {
        ...state,
        returns: updatedReturns,
        currentReturn: updatedCurrentReturn,
      };
    }
    case 'ADD_RETURN_ITEM': {
      const { returnId, item } = action.payload;
      const updatedReturns = state.returns.map(returnItem => {
        if (returnItem.id === returnId) {
          return {
            ...returnItem,
            returnItems: [...returnItem.returnItems, item],
            updatedAt: new Date().toISOString(),
          };
        }
        return returnItem;
      });
      
      // Also update currentReturn if it's the one being updated
      const updatedCurrentReturn = 
        state.currentReturn && state.currentReturn.id === returnId
          ? {
              ...state.currentReturn,
              returnItems: [...state.currentReturn.returnItems, item],
              updatedAt: new Date().toISOString(),
            }
          : state.currentReturn;
          
      return {
        ...state,
        returns: updatedReturns,
        currentReturn: updatedCurrentReturn,
      };
    }
    case 'REMOVE_RETURN_ITEM': {
      const { returnId, itemIndex } = action.payload;
      const updatedReturns = state.returns.map(returnItem => {
        if (returnItem.id === returnId) {
          const updatedItems = [...returnItem.returnItems];
          updatedItems.splice(itemIndex, 1);
          return {
            ...returnItem,
            returnItems: updatedItems,
            updatedAt: new Date().toISOString(),
          };
        }
        return returnItem;
      });
      
      // Also update currentReturn if it's the one being updated
      let updatedCurrentReturn = state.currentReturn;
      if (state.currentReturn && state.currentReturn.id === returnId) {
        const updatedItems = [...state.currentReturn.returnItems];
        updatedItems.splice(itemIndex, 1);
        updatedCurrentReturn = {
          ...state.currentReturn,
          returnItems: updatedItems,
          updatedAt: new Date().toISOString(),
        };
      }
      
      return {
        ...state,
        returns: updatedReturns,
        currentReturn: updatedCurrentReturn,
      };
    }
    case 'SET_CURRENT_RETURN':
      return {
        ...state,
        currentReturn: action.payload,
      };
    case 'CLEAR_CURRENT_RETURN':
      return {
        ...state,
        currentReturn: null,
      };
    default:
      return state;
  }
};

// Provider component
export const ReturnsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [returnsState, dispatch] = useReducer(returnsReducer, initialState);
  const { authState } = useAuth();

  // Fetch returns for the current user when the user changes
  useEffect(() => {
    if (authState.user) {
      dispatch({ type: 'FETCH_RETURNS_START' });
      
      try {
        // In a real app, this would be an API call filtered by the user's ID
        // For now, we'll filter our mock data
        const userReturns = mockReturnRequests.filter(
          returnRequest => returnRequest.userId === authState.user?.id
        );
        
        dispatch({ type: 'FETCH_RETURNS_SUCCESS', payload: userReturns });
      } catch (error) {
        dispatch({
          type: 'FETCH_RETURNS_FAILURE',
          payload: error instanceof Error ? error.message : 'Failed to fetch returns',
        });
      }
    }
  }, [authState.user]);

  // Function to create a new return
  const createReturn = (returnData: Omit<ReturnRequest, 'id' | 'sapcNumber' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    // Generate a unique SAPC number (in production, this would come from an API)
    const sapcNumber = `SAPC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newReturn: ReturnRequest = {
      ...returnData,
      id: uuidv4(),
      sapcNumber,
      createdAt: now,
      updatedAt: now,
    };
    
    dispatch({ type: 'CREATE_RETURN', payload: newReturn });
  };

  // Function to update an existing return
  const updateReturn = (returnId: string, updates: Partial<ReturnRequest>) => {
    dispatch({ type: 'UPDATE_RETURN', payload: { returnId, updates } });
  };

  // Function to add an item to a return
  const addReturnItem = (returnId: string, item: Omit<ReturnItem, 'productId'>) => {
    const fullItem: ReturnItem = {
      ...item,
      productId: item.partNumber, // For simplicity, using partNumber as productId
    };
    
    dispatch({ type: 'ADD_RETURN_ITEM', payload: { returnId, item: fullItem } });
  };

  // Function to remove an item from a return
  const removeReturnItem = (returnId: string, itemIndex: number) => {
    dispatch({ type: 'REMOVE_RETURN_ITEM', payload: { returnId, itemIndex } });
  };

  // Function to get a return by ID
  const getReturnById = (returnId: string) => {
    return returnsState.returns.find(returnItem => returnItem.id === returnId);
  };

  // Function to set the current return
  const setCurrentReturn = (returnId: string) => {
    const foundReturn = getReturnById(returnId);
    if (foundReturn) {
      dispatch({ type: 'SET_CURRENT_RETURN', payload: foundReturn });
    }
  };

  // Function to clear the current return
  const clearCurrentReturn = () => {
    dispatch({ type: 'CLEAR_CURRENT_RETURN' });
  };

  // Create the context value
  const value: ReturnsContextType = {
    returnsState,
    createReturn,
    updateReturn,
    addReturnItem,
    removeReturnItem,
    getReturnById,
    setCurrentReturn,
    clearCurrentReturn,
  };

  return <ReturnsContext.Provider value={value}>{children}</ReturnsContext.Provider>;
};

// Custom hook to use the returns context
export const useReturns = (): ReturnsContextType => {
  const context = useContext(ReturnsContext);
  if (context === undefined) {
    throw new Error('useReturns must be used within a ReturnsProvider');
  }
  return context;
}; 