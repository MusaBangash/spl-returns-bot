import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  IconButton, 
  Divider,
  Avatar,
  List,
  ListItem,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { 
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import Layout from '../components/common/Layout';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chatState, sendMessage, startNewConversation } = useChat();
  const { authState } = useAuth();
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    if (!chatState.activeConversation) {
      startNewConversation();
    }
    
    await sendMessage(message);
    setMessage('');
  };
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [
    chatState.activeConversation?.messages.length,
    chatState.activeConversation?.id,
  ]);
  
  // Start a new conversation if there's no active one
  useEffect(() => {
    if (!chatState.activeConversation && authState.isAuthenticated) {
      startNewConversation();
    }
  }, [authState.isAuthenticated, chatState.activeConversation, startNewConversation]);
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Conversation starter suggestions
  const conversationStarters = [
    'I need to return an item',
    'Check the status of my return',
    "What's your return policy?",
    'How long does a return take?',
    'Can I return an item after 30 days?'
  ];
  
  const handleStarterClick = (starter: string) => {
    setMessage(starter);
  };
  
  const handleNewChat = () => {
    startNewConversation();
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', p: 0, pt: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          height: '100%', 
          maxWidth: '800px', 
          mx: 'auto',
          p: 2,
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Typography variant="h5" component="h1">
              Chat with Returns Assistant
            </Typography>
            
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              onClick={handleNewChat}
            >
              New Chat
            </Button>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Message List */}
          <Paper 
            elevation={0} 
            sx={{ 
              flex: 1, 
              mb: 2, 
              p: 2, 
              overflow: 'auto',
              backgroundColor: (theme) => theme.palette.background.default,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {chatState.activeConversation ? (
              <List>
                {chatState.activeConversation.messages.map((msg) => (
                  <ListItem 
                    key={msg.id}
                    sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      p: 1,
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 0.5
                    }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1,
                          bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main'
                        }}
                      >
                        {msg.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                      </Avatar>
                      
                      <Paper 
                        elevation={1}
                        sx={{
                          p: 1.5,
                          maxWidth: '70%',
                          backgroundColor: msg.sender === 'user' ? 'primary.light' : 'background.paper',
                          color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                          borderRadius: '8px',
                          borderTopLeftRadius: msg.sender === 'user' ? '8px' : '0',
                          borderTopRightRadius: msg.sender === 'user' ? '0' : '8px',
                        }}
                      >
                        <Typography variant="body1">
                          {msg.content}
                        </Typography>
                      </Paper>
                    </Box>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7, 
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        mr: msg.sender === 'user' ? 0 : 5,
                        ml: msg.sender === 'user' ? 5 : 0,
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </ListItem>
                ))}
                
                {chatState.isLoading && (
                  <ListItem
                    sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      p: 1,
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 0.5
                    }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1,
                          bgcolor: 'secondary.main'
                        }}
                      >
                        <BotIcon />
                      </Avatar>
                      
                      <CircularProgress size={20} sx={{ ml: 1 }} />
                    </Box>
                  </ListItem>
                )}
                
                <div ref={messagesEndRef} />
              </List>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%'
              }}>
                <BotIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom align="center">
                  Start a new conversation
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Our returns assistant is here to help you with your return requests.
                </Typography>
              </Box>
            )}
          </Paper>
          
          {/* Conversation Starters */}
          {chatState.activeConversation && chatState.activeConversation.messages.length <= 1 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Suggested conversation starters:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {conversationStarters.map((starter) => (
                  <Box key={starter}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleStarterClick(starter)}
                      sx={{ borderRadius: '20px' }}
                    >
                      {starter}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          
          {/* Message Input */}
          <Paper 
            component="form" 
            onSubmit={handleSendMessage}
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="standard"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={chatState.isLoading || !chatState.activeConversation}
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1, flex: 1 }}
            />
            
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            
            <IconButton 
              color="primary" 
              sx={{ p: '10px' }} 
              type="submit"
              disabled={!message.trim() || chatState.isLoading || !chatState.activeConversation}
            >
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
};

export default ChatPage; 