import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbqwoenlfrfgsrkimwyx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicXdvZW5sZnJmZ3Nya2ltd3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMjQxOTgsImV4cCI6MjA0NDYwMDE5OH0.-Zt-ycxFezDbB5u2iZsCIQ7gaHyOKFrLAaFx_J822gg';


const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;