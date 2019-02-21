define(['app/pages/splash/splash'], function (SplashViewModel) {
    describe('The splash page', function () {
        describe('Ensure the result is true when passed a truthy value', function () {
            it('should return true when passed a value', function () {
                expect(SplashViewModel.sampleCoverage('value')).toBe(true);
                expect(SplashViewModel.sampleCoverage(null)).toBe(false);
            });
        });
    });
});