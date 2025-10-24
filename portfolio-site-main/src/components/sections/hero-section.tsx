'use client';

import { motion } from 'framer-motion';
import { Download, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/config';

export function HeroSection() {
  return (
    <section className="section-padding">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Hi, I'm{' '}
                <span className="gradient-text">{siteConfig.name}</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                {siteConfig.tagline}
              </p>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                I build secure, scalable applications and conduct penetration testing to help organizations strengthen their cybersecurity posture.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group">
                View My Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 pt-8">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary-600"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary-600"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href={siteConfig.links.email}
                className="text-muted-foreground transition-colors hover:text-primary-600"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
