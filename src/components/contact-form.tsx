'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Check honeypot
    if (data.honeypot) {
      return; // Silent fail for bots
    }

    setIsSubmitting(true);

    try {
      // For static deployment, we'll use a client-side approach
      // In production, you would integrate with a service like Formspree, Netlify Forms, or EmailJS
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the form data (in production, you'd send this to your preferred service)
      console.log('Contact form submission:', {
        name: data.name,
        email: data.email,
        message: data.message,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: 'Message sent successfully!',
        description: 'I\'ll get back to you as soon as possible.',
      });
      reset();
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Honeypot field - hidden from users */}
      <input
        {...register('honeypot')}
        type="text"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name *
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Your name"
            className={`transition-all duration-300 ${
              errors.name 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'focus:border-primary-500 focus:ring-primary-500'
            }`}
          />
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {errors.name.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="your.email@example.com"
            className={`transition-all duration-300 ${
              errors.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'focus:border-primary-500 focus:ring-primary-500'
            }`}
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>
      </div>

      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message *
        </label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Tell me about your project or how I can help..."
          rows={6}
          className={`transition-all duration-300 resize-none ${
            errors.message 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'focus:border-primary-500 focus:ring-primary-500'
          }`}
        />
        {errors.message && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {errors.message.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium py-3 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-xs text-muted-foreground text-center"
      >
        * Required fields. Your information will only be used to respond to your message.
      </motion.p>
    </motion.form>
  );
}
