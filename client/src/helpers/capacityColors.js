// Utility function to calculate bus capacity percentage and return appropriate colors
export const getCapacityColors = (capacity, seatsBooked) => {
  const bookedSeats = seatsBooked ? seatsBooked.length : 0;
  const percentage = (bookedSeats / capacity) * 100;
  
  if (percentage <= 60) {
    return {
      backgroundColor: 'bg-green-100',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      status: 'Available',
      percentage: Math.round(percentage)
    };
  } else if (percentage <= 90) {
    return {
      backgroundColor: 'bg-yellow-100',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      status: 'Filling Fast',
      percentage: Math.round(percentage)
    };
  } else {
    return {
      backgroundColor: 'bg-red-100',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      status: 'Almost Full',
      percentage: Math.round(percentage)
    };
  }
};

// Function to get capacity status text
export const getCapacityStatus = (capacity, seatsBooked) => {
  const bookedSeats = seatsBooked ? seatsBooked.length : 0;
  const percentage = (bookedSeats / capacity) * 100;
  
  if (percentage <= 60) {
    return 'Available';
  } else if (percentage <= 90) {
    return 'Filling Fast';
  } else {
    return 'Almost Full';
  }
};

// Function to get capacity percentage
export const getCapacityPercentage = (capacity, seatsBooked) => {
  const bookedSeats = seatsBooked ? seatsBooked.length : 0;
  return Math.round((bookedSeats / capacity) * 100);
};
