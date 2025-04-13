import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Conversation } from '../types';
import { useAuth } from './AuthContext';

// Define the shape of the chat state
interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
}

// Define the context type
interface ChatContextType {
  chatState: ChatState;
  sendMessage: (content: string, attachments?: string[]) => Promise<void>;
  startNewConversation: () => void;
  setActiveConversation: (conversationId: string) => void;
  associateWithReturn: (conversationId: string, returnId: string) => void;
  closeConversation: (conversationId: string) => void;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Action types for our reducer
type ChatAction =
  | { type: 'START_NEW_CONVERSATION'; payload: Conversation }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: Conversation }
  | { type: 'ADD_USER_MESSAGE'; payload: { conversationId: string; message: ChatMessage } }
  | { type: 'ADD_BOT_MESSAGE'; payload: { conversationId: string; message: ChatMessage } }
  | { type: 'MESSAGE_LOADING_START' }
  | { type: 'MESSAGE_LOADING_END' }
  | { type: 'ASSOCIATE_WITH_RETURN'; payload: { conversationId: string; returnId: string } }
  | { type: 'CLOSE_CONVERSATION'; payload: string }
  | { type: 'ERROR'; payload: string };

// Initial state
const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  isLoading: false,
  error: null,
};

// Reducer function
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'START_NEW_CONVERSATION':
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
        activeConversation: action.payload,
        error: null,
      };
    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversation: action.payload,
        error: null,
      };
    case 'ADD_USER_MESSAGE': {
      const { conversationId, message } = action.payload;
      const updatedConversations = state.conversations.map(convo => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            messages: [...convo.messages, message],
            updatedAt: new Date().toISOString(),
          };
        }
        return convo;
      });
      
      // Update active conversation if it's the one receiving the message
      const updatedActiveConvo = 
        state.activeConversation && state.activeConversation.id === conversationId
          ? {
              ...state.activeConversation,
              messages: [...state.activeConversation.messages, message],
              updatedAt: new Date().toISOString(),
            }
          : state.activeConversation;
          
      return {
        ...state,
        conversations: updatedConversations,
        activeConversation: updatedActiveConvo,
      };
    }
    case 'ADD_BOT_MESSAGE': {
      const { conversationId, message } = action.payload;
      const updatedConversations = state.conversations.map(convo => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            messages: [...convo.messages, message],
            updatedAt: new Date().toISOString(),
          };
        }
        return convo;
      });
      
      // Update active conversation if it's the one receiving the message
      const updatedActiveConvo = 
        state.activeConversation && state.activeConversation.id === conversationId
          ? {
              ...state.activeConversation,
              messages: [...state.activeConversation.messages, message],
              updatedAt: new Date().toISOString(),
            }
          : state.activeConversation;
          
      return {
        ...state,
        conversations: updatedConversations,
        activeConversation: updatedActiveConvo,
        isLoading: false,
      };
    }
    case 'MESSAGE_LOADING_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'MESSAGE_LOADING_END':
      return {
        ...state,
        isLoading: false,
      };
    case 'ASSOCIATE_WITH_RETURN': {
      const { conversationId, returnId } = action.payload;
      const updatedConversations = state.conversations.map(convo => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            relatedReturnId: returnId,
            updatedAt: new Date().toISOString(),
          };
        }
        return convo;
      });
      
      // Update active conversation if it's the one being associated
      const updatedActiveConvo = 
        state.activeConversation && state.activeConversation.id === conversationId
          ? {
              ...state.activeConversation,
              relatedReturnId: returnId,
              updatedAt: new Date().toISOString(),
            }
          : state.activeConversation;
          
      return {
        ...state,
        conversations: updatedConversations,
        activeConversation: updatedActiveConvo,
      };
    }
    case 'CLOSE_CONVERSATION': {
      const conversationId = action.payload;
      const updatedConversations = state.conversations.map(convo => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            status: 'closed' as const,
            updatedAt: new Date().toISOString(),
          };
        }
        return convo;
      });
      
      // Update active conversation if it's the one being closed
      const updatedActiveConvo = 
        state.activeConversation && state.activeConversation.id === conversationId
          ? {
              ...state.activeConversation,
              status: 'closed' as const,
              updatedAt: new Date().toISOString(),
            }
          : state.activeConversation;
          
      return {
        ...state,
        conversations: updatedConversations,
        activeConversation: updatedActiveConvo,
      };
    }
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Mock bot responses based on user input
const getBotResponse = async (message: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Basic response logic - in a real app, this would call to an LLM API
  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
    return "Hello! I'm SPL's returns assistant. How can I help you today?";
  } 
  else if (lowercaseMsg.includes('return') && (lowercaseMsg.includes('start') || lowercaseMsg.includes('new') || lowercaseMsg.includes('create'))) {
    return "I'd be happy to help you start a return process. Could you provide your order number, invoice number, or a serial number to get started?";
  }
  else if (lowercaseMsg.includes('status')) {
    return "I can check the status of your return. Could you provide the SAPC number or reference number of the return you'd like to check?";
  }
  else if (lowercaseMsg.includes('help')) {
    return "I can help you with various tasks such as starting a new return, checking the status of an existing return, or providing information about our return policies. What would you like to know?";
  }
  else {
    return "I'm here to help with your returns. You can ask me to start a new return, check the status of an existing return, or inquire about our return policies.";
  }
};

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatState, dispatch] = useReducer(chatReducer, initialState);
  const { authState } = useAuth();

  // Function to start a new conversation
  const startNewConversation = () => {
    if (!authState.user) {
      dispatch({ type: 'ERROR', payload: 'You must be logged in to start a conversation' });
      return;
    }
    
    const now = new Date().toISOString();
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'bot',
      content: `Hello ${authState.user.name}! I'm the SPL returns assistant. How can I help you today?`,
      timestamp: now,
    };
    
    const newConversation: Conversation = {
      id: uuidv4(),
      userId: authState.user.id,
      messages: [welcomeMessage],
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    
    dispatch({ type: 'START_NEW_CONVERSATION', payload: newConversation });
  };

  // Function to set the active conversation
  const setActiveConversation = (conversationId: string) => {
    const conversation = chatState.conversations.find(convo => convo.id === conversationId);
    if (conversation) {
      dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversation });
    } else {
      dispatch({ type: 'ERROR', payload: 'Conversation not found' });
    }
  };

  // Function to send a message
  const sendMessage = async (content: string, attachments?: string[]) => {
    if (!chatState.activeConversation) {
      dispatch({ type: 'ERROR', payload: 'No active conversation' });
      return;
    }
    
    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: now,
      attachments,
    };
    
    // Add user message to the conversation
    dispatch({
      type: 'ADD_USER_MESSAGE',
      payload: { conversationId: chatState.activeConversation.id, message: userMessage },
    });
    
    // Set loading state while getting bot response
    dispatch({ type: 'MESSAGE_LOADING_START' });
    
    try {
      // Get bot response
      const botResponseContent = await getBotResponse(content);
      
      const botMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'bot',
        content: botResponseContent,
        timestamp: new Date().toISOString(),
      };
      
      // Add bot message to the conversation
      dispatch({
        type: 'ADD_BOT_MESSAGE',
        payload: { conversationId: chatState.activeConversation.id, message: botMessage },
      });
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: error instanceof Error ? error.message : 'Failed to get response',
      });
    } finally {
      dispatch({ type: 'MESSAGE_LOADING_END' });
    }
  };

  // Function to associate a conversation with a return
  const associateWithReturn = (conversationId: string, returnId: string) => {
    dispatch({ type: 'ASSOCIATE_WITH_RETURN', payload: { conversationId, returnId } });
  };

  // Function to close a conversation
  const closeConversation = (conversationId: string) => {
    dispatch({ type: 'CLOSE_CONVERSATION', payload: conversationId });
  };

  // Create the context value
  const value: ChatContextType = {
    chatState,
    sendMessage,
    startNewConversation,
    setActiveConversation,
    associateWithReturn,
    closeConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 