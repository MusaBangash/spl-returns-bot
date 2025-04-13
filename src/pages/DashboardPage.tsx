import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { 
  Cached as ProcessingIcon,
  CheckCircle as CompletedIcon, 
  PendingActions as PendingIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';
import { useReturns } from '../context/ReturnsContext';
import { useChat } from '../context/ChatContext';

const DashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const { returnsState } = useReturns();
  const { startNewConversation } = useChat();
  const navigate = useNavigate();
  
  const handleNewReturn = () => {
    navigate('/returns/new');
  };
  
  const handleViewReturn = (returnId: string) => {
    navigate(`/returns/${returnId}`);
  };
  
  const handleStartChat = () => {
    startNewConversation();
    navigate('/chat');
  };
  
  // Calculate statistics
  const pendingReturns = returnsState.returns.filter(ret => ret.status === 'pending').length;
  const processingReturns = returnsState.returns.filter(ret => ret.status === 'processing').length;
  const completedReturns = returnsState.returns.filter(ret => ret.status === 'completed').length;
  
  // Get recent returns (up to 5)
  const recentReturns = [...returnsState.returns]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {authState.user?.name}
          </Typography>
          
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleNewReturn}
              sx={{ mr: 2 }}
            >
              New Return
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleStartChat}
            >
              Start Chat
            </Button>
          </Box>
        </Box>
        
        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '240px' }}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PendingIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {pendingReturns}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Returns
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '240px' }}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ProcessingIcon color="info" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {processingReturns}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Processing
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '240px' }}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CompletedIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {completedReturns}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '240px' }}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <InfoIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {returnsState.returns.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Returns
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
        
        {/* Recent Returns */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Recent Returns
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SAPC Number</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentReturns.length > 0 ? (
                  recentReturns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell>{returnItem.sapcNumber}</TableCell>
                      <TableCell>{formatDate(returnItem.createdAt)}</TableCell>
                      <TableCell>{returnItem.invoiceNumber}</TableCell>
                      <TableCell>
                        <Chip 
                          label={returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)} 
                          color={getStatusColor(returnItem.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{returnItem.returnItems.length}</TableCell>
                      <TableCell>
                        <Button 
                          variant="text" 
                          color="primary" 
                          size="small"
                          onClick={() => handleViewReturn(returnItem.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No returns found. Create your first return.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        {/* Quick Actions */}
        <Box>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '280px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Start a New Return
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Begin the process to return an item for replacement or refund.
                  </Typography>
                  <Button variant="contained" color="primary" onClick={handleNewReturn}>
                    Start Return
                  </Button>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '280px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Chat with Bot
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Have questions? Our returns assistant is ready to help.
                  </Typography>
                  <Button variant="contained" color="secondary" onClick={handleStartChat}>
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '280px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    View Return History
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Check the status and details of all your previous returns.
                  </Typography>
                  <Button variant="contained" color="primary" onClick={() => navigate('/history')}>
                    View History
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default DashboardPage; 