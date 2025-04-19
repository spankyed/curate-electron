import { useAtomValue, useSetAtom } from 'jotai';
import { Tooltip, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { batchDatesAtom, batchScrapeAtom, batchStateAtom } from './store';
import { useNavigate } from 'react-router-dom';
import { throttle } from '@renderer/core/utils/throttle';
import { cancelBatch } from '@renderer/core/api/fetch';

const BatchScrapeButton = () => {
  const state = useAtomValue(batchStateAtom);
  const dates = useAtomValue(batchDatesAtom);
  const scrapeBatch = useSetAtom(batchScrapeAtom);
  const throttledScrapeBatch = throttle(scrapeBatch, 1000);
  const disabled = dates.length === 0 || state === 'loading';
  const isScraping = state === 'loading';

  const navigate = useNavigate();
  const isComplete = state === 'complete';

  const handleCancel = async () => {
    await cancelBatch();
  };

  const onClick = () => {
    if (isComplete) {
      const startDate = dates[0].value;
      const endDate = dates[dates.length - 1].value;
      const queryParams = new URLSearchParams({ startDate, endDate });
      const searchParamsString = queryParams.toString();
      navigate(`/search?${searchParamsString}`);
    } else {
      throttledScrapeBatch();
    }
  };

  const scrapeInfo =
    'Scrape and rank all papers within a certain date range. This will take a few minutes to complete. For the best performance, we recommend having few than 75 starred papers.';
  const viewInfo =
    'Review the papers from this batch, starring the ones you find most interesting. Remember to occasionally un-star papers you no longer find interesting.';

  return (
    <div className="flex items-center ml-4">
      <Tooltip title={isComplete ? viewInfo : scrapeInfo}>
        <div className="flex items-center gap-2">
          <LoadingButton
            variant="contained"
            color={isComplete ? 'success' : 'primary'}
            onClick={onClick}
            disabled={disabled}
            loading={isScraping}
          >
            {isComplete ? 'View Papers' : 'Scrape Batch'}
          </LoadingButton>
          {isScraping && (
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export default BatchScrapeButton;
