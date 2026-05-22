import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  
  export const UserRole = {
    ADMIN: 'admin',
    USER: 'user',
  } as const;
  export type UserRole = (typeof UserRole)[keyof typeof UserRole];
  
  export const AuthProvider = {
    LOCAL: 'local',
    GOOGLE: 'google',
  } as const;
  export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ nullable: true })
    @Exclude() // ẩn field này khi serialize response
    password: string;
  
    @Column({ nullable: true })
    firstName: string;
  
    @Column({ nullable: true })
    lastName: string;
  
    @Column({ nullable: true })
    avatar: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.USER,
    })
    role: UserRole;
  
    @Column({
      type: 'enum',
      enum: AuthProvider,
      default: AuthProvider.LOCAL,
    })
    provider: AuthProvider;
  
    @Column({ nullable: true })
    @Exclude()
    googleId: string;
  
    @Column({ nullable: true })
    @Exclude()
    refreshToken: string;
  
    @Column({ default: false })
    isEmailVerified: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    @Exclude()
    deletedAt: Date;
  }