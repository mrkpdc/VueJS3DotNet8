﻿using System.Threading.Tasks;
using System;
using System.Linq;
using be.DB.Contexts;
using System.Net;
using be.DB.Entities.AuthEntities;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using be.Common;

namespace be.Services
{
    public class NotificationsService
    {
        private DBContext dbContext;
        UserManager<User> userManager;
        public NotificationsService(DBContext dBContext, UserManager<User> userManager)
        {
            this.dbContext = dBContext;
            this.userManager = userManager;
        }

        public async Task<(object Result, HttpStatusCode StatusCode)> GetNotifications(ClaimsPrincipal user)
        {
            string? userId = this.userManager.GetUserId(user);
            if (!string.IsNullOrEmpty(userId))
            {
                var notifications = this.dbContext.Notifications
                     .Where(n => n.RecipientId == Guid.Parse(userId))
                     .OrderByDescending(n => n.ReadDate)
                     .ThenByDescending(n => n.CreationDate)
                     .ToList();

                return (notifications, HttpStatusCode.OK);
            }
            return ConstantValues.ServicesHttpResponses.BadRequest;
        }

        public async Task<(object Result, HttpStatusCode StatusCode)> SetUnreadNotificationsAsRead(ClaimsPrincipal user)
        {
            string? userId = this.userManager.GetUserId(user);
            var unreadNotifications = this.dbContext.Notifications
                     .Where(n => n.RecipientId == Guid.Parse(userId) && n.ReadDate == null)
                     .ToList();
            foreach (var notification in unreadNotifications)
            {
                notification.ReadDate = DateTime.UtcNow;
            }
            await this.dbContext.SaveChangesAsync();
            return ConstantValues.ServicesHttpResponses.OK;
        }
        public async Task<(object Result, HttpStatusCode StatusCode)> DeleteNotification(Guid notificationId)
        {
            var notificationToDelete = this.dbContext.Notifications
                     .Where(n => n.Id == notificationId).FirstOrDefault();
            if (notificationToDelete != null)
            {
                this.dbContext.Remove(notificationToDelete);
                await this.dbContext.SaveChangesAsync();
            }
            return ConstantValues.ServicesHttpResponses.OK;
        }
    }
}