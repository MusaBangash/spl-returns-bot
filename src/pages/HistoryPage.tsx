import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import Layout from '../components/common/Layout';
import { useReturns } from '../context/ReturnsContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`returns-tabpanel-${index}`}
      aria-labelledby={`returns-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { returnsState } = useReturns();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Filter returns based on search query and tab
  const filteredReturns = returnsState.returns.filter(returnItem => {
    const matchesSearch = 
      searchQuery === '' || 
      returnItem.sapcNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnItem.salesOrderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter based on tab value
    if (tabValue === 0) {
      return matchesSearch; // All returns
    } else if (tabValue === 1) {
      return matchesSearch && ['pending', 'processing'].includes(returnItem.status); // Active returns
    } else if (tabValue === 2) {
      return matchesSearch && ['approved', 'completed'].includes(returnItem.status); // Approved/Completed
    } else if (tabValue === 3) {
      return matchesSearch && returnItem.status === 'rejected'; // Rejected
    }
    
    return matchesSearch;
  });
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle view return details
  const handleViewReturn = (returnId: string) => {
    navigate(`/returns/${returnId}`);
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
        <Typography variant="h4" component="h1" gutterBottom>
          Return History
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="return status tabs">
            <Tab label="All Returns" />
            <Tab label="Active" />
            <Tab label="Approved/Completed" />
            <Tab label="Rejected" />
          </Tabs>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by SAPC, invoice, order..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2 }}
            />
            
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Box>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SAPC Number</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReturns.length > 0 ? (
                    filteredReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell>{returnItem.sapcNumber}</TableCell>
                        <TableCell>{formatDate(returnItem.createdAt)}</TableCell>
                        <TableCell>{returnItem.invoiceNumber}</TableCell>
                        <TableCell>{returnItem.salesOrderNumber}</TableCell>
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
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewReturn(returnItem.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {searchQuery 
                          ? 'No returns match your search criteria' 
                          : tabValue === 0 
                            ? 'No returns found. Create your first return.' 
                            : 'No returns with this status.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SAPC Number</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReturns.length > 0 ? (
                    filteredReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell>{returnItem.sapcNumber}</TableCell>
                        <TableCell>{formatDate(returnItem.createdAt)}</TableCell>
                        <TableCell>{returnItem.invoiceNumber}</TableCell>
                        <TableCell>{returnItem.salesOrderNumber}</TableCell>
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
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewReturn(returnItem.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No active returns found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SAPC Number</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReturns.length > 0 ? (
                    filteredReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell>{returnItem.sapcNumber}</TableCell>
                        <TableCell>{formatDate(returnItem.createdAt)}</TableCell>
                        <TableCell>{returnItem.invoiceNumber}</TableCell>
                        <TableCell>{returnItem.salesOrderNumber}</TableCell>
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
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewReturn(returnItem.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No approved or completed returns found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SAPC Number</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReturns.length > 0 ? (
                    filteredReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell>{returnItem.sapcNumber}</TableCell>
                        <TableCell>{formatDate(returnItem.createdAt)}</TableCell>
                        <TableCell>{returnItem.invoiceNumber}</TableCell>
                        <TableCell>{returnItem.salesOrderNumber}</TableCell>
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
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewReturn(returnItem.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No rejected returns found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        
        {returnsState.returns.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: 5 
          }}>
            <Typography variant="h6" gutterBottom>
              No returns found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You haven't created any return requests yet.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/returns/new')}
            >
              Create New Return
            </Button>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default HistoryPage; 