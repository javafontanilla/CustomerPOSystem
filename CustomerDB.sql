USE [CustomerDB]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 05/07/2025 1:57:28 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NOT NULL,
	[MobileNumber] [bigint] NOT NULL,
	[City] [varchar](250) NOT NULL,
	[Long] [varchar](50) NOT NULL,
	[Lat] [varchar](50) NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [varchar](50) NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[UserID] [varchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Customers] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseItems]    Script Date: 05/07/2025 1:57:28 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseItems](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseOrderID] [int] NOT NULL,
	[SKUID] [int] NOT NULL,
	[Quantity] [numeric](18, 0) NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[UserID] [varchar](50) NOT NULL,
 CONSTRAINT [PK_PurchaseItems] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrder]    Script Date: 05/07/2025 1:57:28 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrder](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CustomerID] [int] NOT NULL,
	[DateOfDelivery] [date] NOT NULL,
	[Status] [varchar](50) NOT NULL,
	[AmountDue] [decimal](18, 2) NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [varchar](50) NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[UserID] [varchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_PurchaseOrder] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SKUs]    Script Date: 05/07/2025 1:57:28 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SKUs](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Code] [varchar](50) NOT NULL,
	[UnitPrice] [decimal](18, 2) NOT NULL,
	[ImagePath] [varchar](250) NOT NULL,
	[DateCreated] [datetime] NOT NULL,
	[CreatedBy] [varchar](50) NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[UserID] [varchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_SKUs] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Customers] ON 
GO
INSERT [dbo].[Customers] ([ID], [FirstName], [LastName], [MobileNumber], [City], [Long], [Lat], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (12, N'Ma. Jeanneth', N'Fontanilla', 9760199779, N'Cainta', N'120.992920', N'14.301966', CAST(N'2025-05-06T04:30:49.230' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T15:21:06.813' AS DateTime), N'jcfontanilla', 1)
GO
INSERT [dbo].[Customers] ([ID], [FirstName], [LastName], [MobileNumber], [City], [Long], [Lat], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (18, N'Javanel', N'Fontanilla', 9888281111, N'Antipolo City', N'121.113770', N'14.615764', CAST(N'2025-05-06T14:47:06.107' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T15:20:44.103' AS DateTime), N'jcfontanilla', 0)
GO
INSERT [dbo].[Customers] ([ID], [FirstName], [LastName], [MobileNumber], [City], [Long], [Lat], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (19, N'Aliyah', N'Fontanilla', 9760169779, N'Antipolo City', N'121.223633', N'15.094203', CAST(N'2025-05-06T14:47:52.673' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T15:20:18.020' AS DateTime), N'jcfontanilla', 1)
GO
INSERT [dbo].[Customers] ([ID], [FirstName], [LastName], [MobileNumber], [City], [Long], [Lat], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (20, N'Javanel1', N'Fontanilla', 9760192779, N'Antipolo City', N'121.637323', N'14.258497', CAST(N'2025-05-06T15:09:58.610' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T15:31:59.430' AS DateTime), N'jcfontanilla', 0)
GO
INSERT [dbo].[Customers] ([ID], [FirstName], [LastName], [MobileNumber], [City], [Long], [Lat], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (21, N'Javanel2', N'Fontanilla', 9760179221, N'Taguig', N'121.061327', N'14.517987', CAST(N'2025-05-06T15:18:51.947' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T15:19:06.163' AS DateTime), N'jcfontanilla', 0)
GO
SET IDENTITY_INSERT [dbo].[Customers] OFF
GO
SET IDENTITY_INSERT [dbo].[PurchaseItems] ON 
GO
INSERT [dbo].[PurchaseItems] ([ID], [PurchaseOrderID], [SKUID], [Quantity], [Price], [Timestamp], [UserID]) VALUES (29, 25, 1, CAST(2 AS Numeric(18, 0)), CAST(150.00 AS Decimal(18, 2)), CAST(N'2025-05-06T17:37:32.797' AS DateTime), N'jcfontanilla')
GO
INSERT [dbo].[PurchaseItems] ([ID], [PurchaseOrderID], [SKUID], [Quantity], [Price], [Timestamp], [UserID]) VALUES (30, 25, 2, CAST(5 AS Numeric(18, 0)), CAST(225.00 AS Decimal(18, 2)), CAST(N'2025-05-06T17:37:32.810' AS DateTime), N'jcfontanilla')
GO
INSERT [dbo].[PurchaseItems] ([ID], [PurchaseOrderID], [SKUID], [Quantity], [Price], [Timestamp], [UserID]) VALUES (35, 24, 3, CAST(10 AS Numeric(18, 0)), CAST(1000.00 AS Decimal(18, 2)), CAST(N'2025-05-06T17:42:34.360' AS DateTime), N'jcfontanilla')
GO
INSERT [dbo].[PurchaseItems] ([ID], [PurchaseOrderID], [SKUID], [Quantity], [Price], [Timestamp], [UserID]) VALUES (36, 24, 2, CAST(15 AS Numeric(18, 0)), CAST(675.00 AS Decimal(18, 2)), CAST(N'2025-05-06T17:42:34.367' AS DateTime), N'jcfontanilla')
GO
INSERT [dbo].[PurchaseItems] ([ID], [PurchaseOrderID], [SKUID], [Quantity], [Price], [Timestamp], [UserID]) VALUES (37, 23, 3, CAST(1222 AS Numeric(18, 0)), CAST(122200.00 AS Decimal(18, 2)), CAST(N'2025-05-06T17:42:56.920' AS DateTime), N'jcfontanilla')
GO
INSERT [dbo].[PurchaseItems] ([ID], [PurchaseOrderID], [SKUID], [Quantity], [Price], [Timestamp], [UserID]) VALUES (38, 23, 2, CAST(50 AS Numeric(18, 0)), CAST(2250.00 AS Decimal(18, 2)), CAST(N'2025-05-06T17:42:56.920' AS DateTime), N'jcfontanilla')
GO
SET IDENTITY_INSERT [dbo].[PurchaseItems] OFF
GO
SET IDENTITY_INSERT [dbo].[PurchaseOrder] ON 
GO
INSERT [dbo].[PurchaseOrder] ([ID], [CustomerID], [DateOfDelivery], [Status], [AmountDue], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (23, 12, CAST(N'2025-05-08' AS Date), N'New', CAST(124450.00 AS Decimal(18, 2)), CAST(N'2025-05-06T12:06:31.553' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T17:42:56.913' AS DateTime), N'jcfontanilla', 1)
GO
INSERT [dbo].[PurchaseOrder] ([ID], [CustomerID], [DateOfDelivery], [Status], [AmountDue], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (24, 19, CAST(N'2025-05-08' AS Date), N'New', CAST(1675.00 AS Decimal(18, 2)), CAST(N'2025-05-06T16:37:36.160' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T17:42:34.247' AS DateTime), N'jcfontanilla', 1)
GO
INSERT [dbo].[PurchaseOrder] ([ID], [CustomerID], [DateOfDelivery], [Status], [AmountDue], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (25, 19, CAST(N'2025-05-08' AS Date), N'New', CAST(375.00 AS Decimal(18, 2)), CAST(N'2025-05-06T17:37:32.667' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T17:37:32.667' AS DateTime), N'jcfontanilla', 1)
GO
SET IDENTITY_INSERT [dbo].[PurchaseOrder] OFF
GO
SET IDENTITY_INSERT [dbo].[SKUs] ON 
GO
INSERT [dbo].[SKUs] ([ID], [Name], [Code], [UnitPrice], [ImagePath], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (1, N'Scotch Brite 10cm', N'SB100123', CAST(75.00 AS Decimal(18, 2)), N'/images/solaya.png', CAST(N'2025-05-06T04:30:49.230' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T17:14:04.673' AS DateTime), N'jcfontanilla', 1)
GO
INSERT [dbo].[SKUs] ([ID], [Name], [Code], [UnitPrice], [ImagePath], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (2, N'Coca Cola 500ml', N'CC500', CAST(45.00 AS Decimal(18, 2)), N'/images/BriefCaseClose.jpg', CAST(N'2025-05-06T05:18:41.417' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T17:49:25.197' AS DateTime), N'jcfontanilla', 1)
GO
INSERT [dbo].[SKUs] ([ID], [Name], [Code], [UnitPrice], [ImagePath], [DateCreated], [CreatedBy], [Timestamp], [UserID], [IsActive]) VALUES (3, N'Paper Towel', N'PT22', CAST(100.00 AS Decimal(18, 2)), N'/images/image.png', CAST(N'2025-05-06T05:26:23.310' AS DateTime), N'jcfontanilla', CAST(N'2025-05-06T17:48:45.577' AS DateTime), N'jcfontanilla', 1)
GO
SET IDENTITY_INSERT [dbo].[SKUs] OFF
GO
