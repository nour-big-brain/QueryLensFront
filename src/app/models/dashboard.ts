export interface Dashboard {
  _id?: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName: string;
  cards?: string[];
  sharedWith?: { userId: string; username: string; permission: 'view' | 'edit' | 'admin'; sharedAt: Date }[];
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  comments?: Comment[];
  metabaseDashboardId?: number;
  metabaseData?: any; // Adjust type based on Metabase response
}

export interface Comment {
  _id?: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}