import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, List, ListItem } from '@mui/material';

const AdminPage = () => {
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        try {
            const response = await axios.get('/api/managers');
            setManagers(response.data);
        } catch (error) {
            console.error('Error fetching managers:', error);
        }
    };

    const handleRemoveManager = async (id) => {
        try {
            await axios.delete(`/api/managers/${id}`);
            fetchManagers(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error removing manager:', error);
            alert(error.response?.data?.message || 'Failed to remove manager');
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h4" mb={2}>Admin Dashboard</Typography>
            {managers.map((manager) => (
                <Card key={manager._id} sx={{ mb: 2, p: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{manager.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Email: {manager.email}</Typography>
                        <Typography variant="body2" mt={1}>
                            Parking Spots: {manager.parkingSpots.length}
                        </Typography>
                        <List>
                            {manager.parkingSpots.map((spot) => (
                                <ListItem key={spot._id} sx={{ pl: 0 }}>
                                    {spot.name}
                                </ListItem>
                            ))}
                        </List>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleRemoveManager(manager._id)}
                            disabled={manager.parkingSpots.length > 0}
                        >
                            Remove Manager
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default AdminPage;
