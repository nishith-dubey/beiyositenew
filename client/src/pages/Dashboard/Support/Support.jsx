import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { History } from 'lucide-react';
import AuthContext from '@/context/AuthContext';

const Support = () => {
  const [helpTopic, setHelpTopic] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tickets,setTickets] = useState(null);
  const [oldticket,setOldTicket] = useState(false);
  const { user} = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await axios.post('https://beiyo-admin.vercel.app/api/dashboard/raise-ticket', {
        userId : user._id,
        helpTopic,
        description,
      });
      setSuccess('Ticket raised successfully!');
      setHelpTopic('');
      setDescription('');
    } catch (error) {
      setError('Error raising ticket. Please try again.');
    }
  };
  const handleRaiseTicket = async ()=>{
   try {
    console.log(user._id);
    setOldTicket(true);
    const response = await axios.get(`https://beiyo-admin.vercel.app/api/dashboard/oldTickets/${user._id}`);
      setTickets(response.data);
      
      console.log(tickets);
   } catch (error) {
    console.log(error)
   }  
  }

  return (
<div>
  {!oldticket?(
    <div>
       <button className='h-full p-2 w-100 rounded-lg flex border-2 gap-1 border-black' onClick={handleRaiseTicket}> <History/>  Raised Tickets</button>
       <Box component="form" onSubmit={handleSubmit}>
        <div className='flex justify-between'>
        <Typography variant="h4" gutterBottom>Raise a Ticket</Typography>
       
        </div>
    
        {success && <Typography color="success" gutterBottom>{success}</Typography>}
        {error && <Typography color="error" gutterBottom>{error}</Typography>}
        <TextField
          label="Help Topic"
          value={helpTopic}
          onChange={(e) => setHelpTopic(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" variant="contained" color="primary">Raise Ticket</Button>
      </Box>
    </div>
       
  ):(
   <div>
     <Typography variant="h4" gutterBottom>Old Tickets</Typography>
     {tickets.map((ticket) => (
      <Box key={ticket._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
        <Typography variant="body1">Help Topic: {ticket.helpTopic}</Typography>
        <Typography variant="body2">Date: {new Date(ticket.createdAt).toLocaleDateString()}</Typography>
        <Typography variant="body2">Status: {ticket.status}</Typography>
      </Box>
    ))}
   </div>

  )
  }
</div>
  );
};

export default Support;
