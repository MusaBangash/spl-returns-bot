import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
  LocalShipping as ShippingIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import Layout from '../components/common/Layout';
import { useReturns } from '../context/ReturnsContext';
import { returnReasons } from '../mock-data/data';

const ReturnDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { returnsState, getReturnById, setCurrentReturn } = useReturns();
  
  // Set the current return when the page loads
  useEffect(() => {
    if (id) {
      setCurrentReturn(id);
    }
  }, [id, setCurrentReturn]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handlePrintReturnForm = () => {
    // In a real application, this would generate and print a return form
    window.alert('Printing return form...');
  };
  
  if (!returnsState.currentReturn) {
    return (
      <Layout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '500px', 
          flexDirection: 'column'
        }}>
          {returnsState.isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                Return not found
              </Typography>
              <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={handleBack}
                variant="contained"
              >
                Go Back
              </Button>
            </>
          )}
        </Box>
      </Layout>
    );
  }
  
  const { currentReturn } = returnsState;
  
  // Find the reason details for each return item
  const returnReasonDetails = currentReturn.returnItems.map(item => ({
    ...item,
    reasonDetails: returnReasons.find(reason => reason.id === item.returnReason),
  }));
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get status color
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          
          <Typography variant="h4" component="h1">
            Return Details
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 calc(66.666% - 24px)', minWidth: '0' }}>
            {/* Main return details */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {currentReturn.sapcNumber}
                </Typography>
                
                <Chip 
                  label={currentReturn.status.charAt(0).toUpperCase() + currentReturn.status.slice(1)} 
                  color={getStatusColor(currentReturn.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                />
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '120px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Created Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(currentReturn.createdAt)}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '120px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(currentReturn.updatedAt)}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '120px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Order Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentReturn.salesOrderNumber}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '120px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Invoice Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentReturn.invoiceNumber}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '120px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Customer PO
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentReturn.customerPO}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '120px' }}>
                  <Typography variant="body2" color="text.secondary">
                    Customer
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentReturn.customerName}
                  </Typography>
                </Box>
              </Box>
              
              {currentReturn.totalRestockFee > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This return has a restocking fee of ${currentReturn.totalRestockFee.toFixed(2)}.
                </Alert>
              )}
              
              {currentReturn.requiresReplacement && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Replacement items will be processed upon receipt of returned goods.
                </Alert>
              )}
            </Paper>
            
            {/* Return Items */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Return Items
              </Typography>
              
              <List>
                {returnReasonDetails.map((item, index) => (
                  <Card key={item.serialNumber} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ flex: '1 1 calc(66.666% - 8px)', minWidth: '0' }}>
                          <Typography variant="subtitle1">
                            {item.partNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Serial: {item.serialNumber}
                          </Typography>
                          
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Reason:
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {item.reasonDetails?.label}
                            </Typography>
                            <Typography variant="body2">
                              {item.details}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ flex: '1 1 calc(33.333% - 8px)', minWidth: '120px' }}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip 
                              label={item.reasonDetails?.noFee ? 'No Fee' : 'Restock Fee Applies'} 
                              color={item.reasonDetails?.noFee ? 'success' : 'warning'} 
                              size="small"
                            />
                            
                            {item.restockFee && (
                              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                Fee: ${item.restockFee.toFixed(2)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </Paper>
            
            {/* Comments */}
            {currentReturn.comments && currentReturn.comments.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Comments
                </Typography>
                
                <List>
                  {currentReturn.comments.map((comment, index) => (
                    <ListItem key={index} divider={index < currentReturn.comments!.length - 1}>
                      <ListItemText primary={comment} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
          
          {/* Actions sidebar */}
          <Box sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '250px' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              
              <Button
                variant="contained"
                fullWidth
                startIcon={<PrintIcon />}
                onClick={handlePrintReturnForm}
                sx={{ mb: 2 }}
              >
                Print Return Form
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ReceiptIcon />}
                sx={{ mb: 2 }}
              >
                View Invoice
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ShippingIcon />}
                disabled={currentReturn.status !== 'approved'}
              >
                Track Shipment
              </Button>
            </Paper>
            
            {/* Return Status */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Return Status
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Status
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentReturn.status.charAt(0).toUpperCase() + currentReturn.status.slice(1)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Next Steps
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentReturn.status === 'pending' && 'Awaiting approval'}
                  {currentReturn.status === 'approved' && 'Prepare items for return'}
                  {currentReturn.status === 'processing' && 'Items in transit'}
                  {currentReturn.status === 'completed' && 'Return process completed'}
                  {currentReturn.status === 'rejected' && 'Return request rejected'}
                </Typography>
              </Box>
              
              {currentReturn.status === 'approved' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Your return has been approved! Please package the item(s) and follow the shipping instructions on the return form.
                </Alert>
              )}
              
              {currentReturn.status === 'rejected' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Your return request has been rejected. Please contact customer service for more information.
                </Alert>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default ReturnDetailPage; 