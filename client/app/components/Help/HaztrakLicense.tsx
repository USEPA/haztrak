import { HtCard } from 'app/components/legacyUi';
import React from 'react';

export function HaztrakLicense() {
  return (
    <HtCard className="shadow-lg mx-5 my-3 bg-white p-2">
      <HtCard.Body>
        <div className="d-flex flex-column text-muted">
          <p className="text-start">MIT License</p>
          <p className="text-start">Copyright (c) 2022 U.S. Environmental Protection Agency</p>
          <p className="text-start">
            Permission is hereby granted, free of charge, to any person obtaining a copy of this
            software and associated documentation files (the "Software"), to deal in the Software
            without restriction, including without limitation the rights to use, copy, modify,
            merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
            permit persons to whom the Software is furnished to do so, subject to the following
            conditions:
          </p>
          <p className="text-start">
            The above copyright notice and this permission notice shall be included in all copies or
            substantial portions of the Software.
          </p>
          <p className="text-start">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
            LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
            OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
            OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </div>
      </HtCard.Body>
    </HtCard>
  );
}
