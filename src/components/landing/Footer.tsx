import { motion } from 'framer-motion';
import { Layers, Github, FileText, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30">
              <Layers className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-gradient">AutoScaleX</span>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="#"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-4 h-4" />
              Docs
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact
            </a>
          </div>

          <div className="text-sm text-muted-foreground">
            AutoScaleX © 2026
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
