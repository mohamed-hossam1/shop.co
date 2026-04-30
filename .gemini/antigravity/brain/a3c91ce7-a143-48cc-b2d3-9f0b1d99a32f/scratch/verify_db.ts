import { getAllCategories } from './actions/categoriesAction';

async function verify() {
  const categories = await getAllCategories();
  if (categories.success) {
    console.log('Database connection verified. Categories found:', categories.data?.length);
  } else {
    console.error('Database connection failed:', categories.message);
    process.exit(1);
  }
}

verify();
