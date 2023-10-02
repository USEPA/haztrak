import { Root } from 'components/Nav/Root';
import { SiteDetails } from 'features/haztrakSite/SiteDetails';
import { SiteList } from 'features/haztrakSite/SiteList';
import { ManifestDetails } from 'features/manifest/ManifestDetails';
import { ManifestList } from 'features/manifest/ManifestList';
import { NewManifest } from 'features/manifest/NewManifest';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        lazy: () => import('./features/home'),
      },
      {
        path: '/notifications',
        lazy: () => import('./features/notifications'),
      },
      {
        path: '/profile',
        lazy: () => import('./features/profile'),
      },
      {
        path: '/site',
        children: [
          {
            path: '',
            element: <SiteList />,
          },
          {
            path: ':siteId',
            element: <SiteDetails />,
          },
          {
            path: ':siteId/manifest',
            children: [
              {
                path: '',
                element: <ManifestList />,
              },
              {
                path: 'new',
                element: <NewManifest />,
              },
              {
                path: ':mtn/:action',
                element: <ManifestDetails />,
              },
            ],
          },
        ],
      },
      {
        path: '/manifest',
        children: [
          {
            path: '',
            element: <ManifestList />,
          },
          {
            path: 'new',
            element: <NewManifest />,
          },
          {
            path: ':mtn/:action',
            element: <ManifestDetails />,
          },
        ],
      },
      {
        path: '*',
        element: <p>404 Page Not Found</p>,
      },
    ],
  },
]);
//   <Route path="/coming-soon" element={<UnderConstruction />} />
//   <Route path="/login" element={<Login />} />
//   <Route path="/about" element={<About />} />
//   {/* If unknown route, display 404*/}
//   <Route
//     path="*"
//     element={
//       <HtCard>
//         <HtCard.Header title="This is not the page you're looking for..." />
//         <HtCard.Body className="d-grid justify-content-center">
//           <h1 className="display-1 d-flex justify-content-center">404</h1>
//           <h4>Resource not found</h4>
//         </HtCard.Body>
//         <HtCard.Footer>
//           <Button onClick={() => navigate(-1)}>Return</Button>
//         </HtCard.Footer>
//       </HtCard>
//     }
//   />
// </Routes>
