export const mockProducts = [
  {
    id: "p1",
    name: "Silk Cami Set",
    collection: "Luxe Silk",
    price: 120,
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=3087&auto=format&fit=crop",
    tags: ["Featured", "New"],
    stock: { S: 12, M: 8, L: 4, XL: 2 }
  },
  {
    id: "p2",
    name: "Cotton Robe",
    collection: "Essential Cotton",
    price: 85,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3270&auto=format&fit=crop",
    tags: ["Best Seller"],
    stock: { S: 5, M: 3, L: 1, XL: 0 }
  },
  {
    id: "p3",
    name: "Satin Slip Dress",
    collection: "Evening Glow",
    price: 145,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=3280&auto=format&fit=crop",
    tags: ["New"],
    stock: { S: 15, M: 12, L: 10, XL: 5 }
  },
  {
    id: "p4",
    name: "Linen Lounge Set",
    collection: "Summer Breeze",
    price: 110,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=3172&auto=format&fit=crop",
    tags: ["Sold Out"],
    stock: { S: 0, M: 0, L: 0, XL: 0 }
  },
  {
    id: "p5",
    name: "Velvet PJ Set",
    collection: "Winter Nights",
    price: 160,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=3270&auto=format&fit=crop",
    tags: ["Limited Edition"],
    stock: { S: 4, M: 2, L: 2, XL: 1 }
  }
];

export const mockOrders = [
  {
    id: "o1",
    orderNumber: "#KAM-1001",
    customerName: "Sarah Jenkins",
    items: [
      { name: "Silk Cami Set", quantity: 1, price: 120 },
      { name: "Cotton Robe", quantity: 1, price: 85 }
    ],
    totalAmount: 205,
    deliveryAddress: "123 Maple Avenue, London, UK",
    status: "Delivered",
    date: "2024-04-28",
    trackingTimeline: [
      { status: "Pending", date: "2024-04-28 09:00", description: "Order received" },
      { status: "Processing", date: "2024-04-28 11:30", description: "Preparing for shipment" },
      { status: "Shipped", date: "2024-04-29 14:20", description: "In transit with DHL" },
      { status: "Delivered", date: "2024-05-01 10:15", description: "Delivered to recipient" }
    ]
  },
  {
    id: "o2",
    orderNumber: "#KAM-1002",
    customerName: "Michael Chen",
    items: [
      { name: "Satin Slip Dress", quantity: 2, price: 145 }
    ],
    totalAmount: 290,
    deliveryAddress: "456 Oak Street, New York, USA",
    status: "Shipped",
    date: "2024-05-02",
    trackingTimeline: [
      { status: "Pending", date: "2024-05-02 14:00", description: "Order received" },
      { status: "Processing", date: "2024-05-02 16:45", description: "Quality check completed" },
      { status: "Shipped", date: "2024-05-03 09:30", description: "Left the warehouse" }
    ]
  },
  {
    id: "o3",
    orderNumber: "#KAM-1003",
    customerName: "Emma Watson",
    items: [
      { name: "Linen Lounge Set", quantity: 1, price: 110 }
    ],
    totalAmount: 110,
    deliveryAddress: "789 Pine Road, Sydney, Australia",
    status: "Processing",
    date: "2024-05-04",
    trackingTimeline: [
      { status: "Pending", date: "2024-05-04 08:20", description: "Order received" },
      { status: "Processing", date: "2024-05-04 13:00", description: "Packaging items" }
    ]
  },
  {
    id: "o4",
    orderNumber: "#KAM-1004",
    customerName: "James Wilson",
    items: [
      { name: "Velvet PJ Set", quantity: 1, price: 160 }
    ],
    totalAmount: 160,
    deliveryAddress: "321 Elm St, Toronto, Canada",
    status: "Pending",
    date: "2024-05-05",
    trackingTimeline: [
      { status: "Pending", date: "2024-05-05 07:45", description: "Payment verified" }
    ]
  }
];

export const mockCustomers = [
  {
    id: "c1",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+44 7700 900077",
    totalOrders: 3,
    lastOrderDate: "2024-04-28",
    orderHistory: ["#KAM-1001", "#KAM-0950", "#KAM-0912"]
  },
  {
    id: "c2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1 212 555 0123",
    totalOrders: 1,
    lastOrderDate: "2024-05-02",
    orderHistory: ["#KAM-1002"]
  },
  {
    id: "c3",
    name: "Emma Watson",
    email: "emma.w@example.com",
    phone: "+61 2 9876 5432",
    totalOrders: 2,
    lastOrderDate: "2024-05-04",
    orderHistory: ["#KAM-1003", "#KAM-0988"]
  }
];

export const mockAnalytics = {
  revenueData: [
    { name: "Jan", revenue: 4500 },
    { name: "Feb", revenue: 5200 },
    { name: "Mar", revenue: 4800 },
    { name: "Apr", revenue: 6100 },
    { name: "May", revenue: 7500 }
  ],
  bestSellers: [
    { name: "Silk Cami Set", sales: 120 },
    { name: "Satin Slip Dress", sales: 95 },
    { name: "Cotton Robe", sales: 80 },
    { name: "Linen Set", sales: 45 }
  ],
  statusBreakdown: [
    { name: "Delivered", value: 45 },
    { name: "Shipped", value: 25 },
    { name: "Processing", value: 20 },
    { name: "Pending", value: 10 }
  ]
};
